-- Sellable management core: first-class companies, contacts, tasks and
-- server-enforced plan limits. Existing CRM tables and transactional RPCs are
-- preserved; the limit trigger hardens every write path without rewriting them.

create table public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  website text,
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_companies_tenant_identity unique (organization_id, id),
  constraint crm_companies_name_check check (btrim(name) <> '' and char_length(name) <= 200),
  constraint crm_companies_website_check check (website is null or (char_length(website) <= 500 and website ~ '^https://')),
  constraint crm_companies_notes_check check (notes is null or char_length(notes) <= 2000)
);
create unique index crm_companies_organization_name_idx
  on public.crm_companies (organization_id, lower(name));
create trigger crm_companies_set_updated_at before update on public.crm_companies
for each row execute function public.set_updated_at();
insert into public.crm_companies (organization_id, name, created_by)
select distinct on (contact.organization_id, lower(contact.company))
  contact.organization_id, btrim(contact.company), contact.created_by
from public.crm_contacts as contact
where nullif(btrim(contact.company), '') is not null
order by contact.organization_id, lower(contact.company), contact.created_at;
alter table public.crm_contacts add column company_id uuid;
update public.crm_contacts as contact
set company_id = company.id
from public.crm_companies as company
where company.organization_id = contact.organization_id
  and lower(company.name) = lower(contact.company);
alter table public.crm_contacts add constraint crm_contacts_company_id_fkey
  foreign key (organization_id, company_id)
  references public.crm_companies (organization_id, id) on delete set null (company_id);
create index crm_contacts_company_id_idx on public.crm_contacts (organization_id, company_id);
create table public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contact_id uuid,
  opportunity_id uuid,
  title text not null,
  notes text,
  due_date date,
  status text not null default 'pending',
  assigned_to uuid references auth.users (id) on delete set null,
  created_by uuid not null references auth.users (id) on delete restrict,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_tasks_tenant_identity unique (organization_id, id),
  constraint crm_tasks_contact_fkey foreign key (organization_id, contact_id)
    references public.crm_contacts (organization_id, id) on delete set null (contact_id),
  constraint crm_tasks_opportunity_fkey foreign key (organization_id, opportunity_id)
    references public.crm_opportunities (organization_id, id) on delete set null (opportunity_id),
  constraint crm_tasks_title_check check (btrim(title) <> '' and char_length(title) <= 200),
  constraint crm_tasks_notes_check check (notes is null or char_length(notes) <= 2000),
  constraint crm_tasks_status_check check (status in ('pending', 'completed')),
  constraint crm_tasks_completion_check check (
    (status = 'pending' and completed_at is null) or (status = 'completed' and completed_at is not null)
  )
);
create index crm_tasks_organization_due_idx on public.crm_tasks (organization_id, status, due_date);
create trigger crm_tasks_set_updated_at before update on public.crm_tasks
for each row execute function public.set_updated_at();
alter table public.crm_companies enable row level security;
alter table public.crm_tasks enable row level security;
create policy crm_companies_select_member on public.crm_companies for select to authenticated
using (public.is_organization_member(organization_id));
create policy crm_tasks_select_member on public.crm_tasks for select to authenticated
using (public.is_organization_member(organization_id));
revoke all on table public.crm_companies, public.crm_tasks from anon, authenticated;
grant select on table public.crm_companies, public.crm_tasks to authenticated;
grant all on table public.crm_companies, public.crm_tasks to service_role;
create or replace function public.current_crm_limits(p_organization_id uuid)
returns table (contact_limit integer, opportunity_limit integer)
language sql stable security definer set search_path = ''
as $$
  select plan.contact_limit, plan.opportunity_limit
  from public.plans as plan
  where plan.id = coalesce((
    select subscription.plan_id
    from public.subscriptions as subscription
    where subscription.organization_id = p_organization_id
      and subscription.access_state in ('active', 'grace_period')
    order by subscription.updated_at desc limit 1
  ), 'free');
$$;
create or replace function public.enforce_crm_plan_limit()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  limits record;
  current_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.organization_id::text || ':crm-limit', 0));
  select * into limits from public.current_crm_limits(new.organization_id);
  if tg_table_name = 'crm_contacts' then
    select count(*)::integer into current_count from public.crm_contacts where organization_id = new.organization_id;
    if current_count >= limits.contact_limit then
      raise exception 'contact limit reached' using errcode = 'P0001';
    end if;
  elsif tg_table_name = 'crm_opportunities' then
    select count(*)::integer into current_count from public.crm_opportunities where organization_id = new.organization_id;
    if current_count >= limits.opportunity_limit then
      raise exception 'opportunity limit reached' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;
create trigger crm_contacts_enforce_plan_limit before insert on public.crm_contacts
for each row execute function public.enforce_crm_plan_limit();
create trigger crm_opportunities_enforce_plan_limit before insert on public.crm_opportunities
for each row execute function public.enforce_crm_plan_limit();
create or replace function public.create_crm_contact(
  p_organization_id uuid, p_name text, p_company_id uuid default null,
  p_email text default null, p_phone text default null, p_notes text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); new_id uuid; company_name text;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if p_company_id is not null then
    select name into company_name from public.crm_companies
    where organization_id = p_organization_id and id = p_company_id;
    if company_name is null then raise exception 'company not found in organization' using errcode = '42501'; end if;
  end if;
  insert into public.crm_contacts (organization_id, name, company_id, company, email, phone, notes, created_by)
  values (p_organization_id, nullif(btrim(p_name), ''), p_company_id, company_name,
    nullif(lower(btrim(p_email)), ''), nullif(btrim(p_phone), ''), nullif(btrim(p_notes), ''), current_user_id)
  returning id into new_id;
  return new_id;
end;
$$;
create or replace function public.create_crm_company(
  p_organization_id uuid, p_name text, p_website text default null, p_notes text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); new_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  insert into public.crm_companies (organization_id, name, website, notes, created_by)
  values (p_organization_id, nullif(btrim(p_name), ''), nullif(btrim(p_website), ''), nullif(btrim(p_notes), ''), current_user_id)
  returning id into new_id;
  return new_id;
end;
$$;
create or replace function public.create_crm_task(
  p_organization_id uuid, p_title text, p_due_date date default null,
  p_contact_id uuid default null, p_opportunity_id uuid default null, p_notes text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); new_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if p_contact_id is not null and not exists (
    select 1 from public.crm_contacts where organization_id = p_organization_id and id = p_contact_id
  ) then raise exception 'contact not found in organization' using errcode = '42501'; end if;
  if p_opportunity_id is not null and not exists (
    select 1 from public.crm_opportunities where organization_id = p_organization_id and id = p_opportunity_id
  ) then raise exception 'opportunity not found in organization' using errcode = '42501'; end if;
  insert into public.crm_tasks (organization_id, contact_id, opportunity_id, title, notes, due_date, assigned_to, created_by)
  values (p_organization_id, p_contact_id, p_opportunity_id, nullif(btrim(p_title), ''), nullif(btrim(p_notes), ''), p_due_date, current_user_id, current_user_id)
  returning id into new_id;
  return new_id;
end;
$$;
create or replace function public.set_crm_task_status(
  p_organization_id uuid, p_task_id uuid, p_status text
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); updated_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'completed') then raise exception 'invalid task status' using errcode = '22023'; end if;
  update public.crm_tasks set status = p_status,
    completed_at = case when p_status = 'completed' then statement_timestamp() else null end
  where organization_id = p_organization_id and id = p_task_id returning id into updated_id;
  if updated_id is null then raise exception 'task not found in organization' using errcode = 'P0002'; end if;
  return updated_id;
end;
$$;
revoke all on function public.current_crm_limits(uuid), public.enforce_crm_plan_limit() from public;
revoke all on function public.create_crm_contact(uuid,text,uuid,text,text,text) from public;
revoke all on function public.create_crm_company(uuid,text,text,text) from public;
revoke all on function public.create_crm_task(uuid,text,date,uuid,uuid,text) from public;
revoke all on function public.set_crm_task_status(uuid,uuid,text) from public;
grant execute on function public.create_crm_contact(uuid,text,uuid,text,text,text) to authenticated;
grant execute on function public.create_crm_company(uuid,text,text,text) to authenticated;
grant execute on function public.create_crm_task(uuid,text,date,uuid,uuid,text) to authenticated;
grant execute on function public.set_crm_task_status(uuid,uuid,text) to authenticated;
