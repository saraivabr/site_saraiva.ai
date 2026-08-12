-- Multiple named pipelines without rewriting the proven CRM stages or write
-- boundary. Existing RPCs continue targeting the default pipeline.

create table public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  is_archived boolean not null default false,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_pipelines_tenant_identity unique (organization_id, id),
  constraint crm_pipelines_name_check check (btrim(name) <> '' and char_length(name) <= 100),
  constraint crm_pipelines_default_active_check check (not is_default or not is_archived)
);
create unique index crm_pipelines_organization_name_idx
  on public.crm_pipelines (organization_id, lower(name))
  where not is_archived;
create unique index crm_pipelines_one_default_idx
  on public.crm_pipelines (organization_id) where is_default;
create index crm_pipelines_organization_active_idx
  on public.crm_pipelines (organization_id, is_archived, created_at);
create trigger crm_pipelines_set_updated_at
before update on public.crm_pipelines
for each row execute function public.set_updated_at();
insert into public.crm_pipelines (
  organization_id, name, is_default, created_by
)
select organization.id, 'Pipeline principal', true, organization.created_by
from public.organizations as organization;
create or replace function public.create_default_crm_pipeline()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.crm_pipelines (
    organization_id, name, is_default, created_by
  ) values (
    new.id, 'Pipeline principal', true, new.created_by
  );
  return new;
end;
$$;
create trigger organizations_create_default_crm_pipeline
after insert on public.organizations
for each row execute function public.create_default_crm_pipeline();
alter table public.crm_opportunities add column pipeline_id uuid;
update public.crm_opportunities as opportunity
set pipeline_id = pipeline.id
from public.crm_pipelines as pipeline
where pipeline.organization_id = opportunity.organization_id
  and pipeline.is_default;
alter table public.crm_opportunities
  alter column pipeline_id set not null,
  add constraint crm_opportunities_pipeline_id_fkey
    foreign key (organization_id, pipeline_id)
    references public.crm_pipelines (organization_id, id)
    on delete restrict;
drop index public.crm_opportunities_organization_stage_idx;
create index crm_opportunities_organization_pipeline_stage_idx
  on public.crm_opportunities (organization_id, pipeline_id, stage);
create or replace function public.assign_and_validate_crm_pipeline()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.pipeline_id is null then
    select pipeline.id into new.pipeline_id
    from public.crm_pipelines as pipeline
    where pipeline.organization_id = new.organization_id
      and pipeline.is_default
      and not pipeline.is_archived;
  end if;

  if new.pipeline_id is null or not exists (
    select 1
    from public.crm_pipelines as pipeline
    where pipeline.organization_id = new.organization_id
      and pipeline.id = new.pipeline_id
      and not pipeline.is_archived
  ) then
    raise exception 'pipeline not found in organization' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger crm_opportunities_assign_pipeline
before insert or update of organization_id, pipeline_id on public.crm_opportunities
for each row execute function public.assign_and_validate_crm_pipeline();
create or replace function public.internal_crm_pipeline_limit(p_organization_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select plan.pipeline_limit
  from public.plans as plan
  where plan.id = coalesce((
    select subscription.plan_id
    from public.subscriptions as subscription
    where subscription.organization_id = p_organization_id
      and subscription.access_state in ('active', 'grace_period')
    order by subscription.updated_at desc
    limit 1
  ), 'free');
$$;
create or replace function public.current_crm_pipeline_limit(p_organization_id uuid)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_organization_member(p_organization_id) then
    raise exception 'organization access denied' using errcode = '42501';
  end if;
  return public.internal_crm_pipeline_limit(p_organization_id);
end;
$$;
create or replace function public.enforce_crm_pipeline_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed_count integer;
  current_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.organization_id::text || ':pipeline-limit', 0));
  allowed_count := public.internal_crm_pipeline_limit(new.organization_id);
  select count(*)::integer into current_count
  from public.crm_pipelines as pipeline
  where pipeline.organization_id = new.organization_id
    and not pipeline.is_archived;

  if current_count >= allowed_count then
    raise exception 'pipeline limit reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger crm_pipelines_enforce_plan_limit
before insert on public.crm_pipelines
for each row execute function public.enforce_crm_pipeline_plan_limit();
alter table public.crm_pipelines enable row level security;
create policy crm_pipelines_select_member
on public.crm_pipelines for select to authenticated
using (public.is_organization_member(organization_id));
revoke all on table public.crm_pipelines from anon, authenticated;
grant select on table public.crm_pipelines to authenticated;
grant all on table public.crm_pipelines to service_role;
create or replace function public.create_crm_pipeline(
  p_organization_id uuid,
  p_name text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_pipeline_id uuid;
begin
  if current_user_id is null or not public.can_administer_organization(p_organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;

  insert into public.crm_pipelines (organization_id, name, created_by)
  values (p_organization_id, nullif(btrim(p_name), ''), current_user_id)
  returning id into new_pipeline_id;

  insert into public.audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id, new_value
  ) values (
    p_organization_id, current_user_id, 'crm.pipeline_created', 'crm_pipeline',
    new_pipeline_id::text, jsonb_build_object('name', btrim(p_name))
  );
  return new_pipeline_id;
end;
$$;
create or replace function public.rename_crm_pipeline(
  p_organization_id uuid,
  p_pipeline_id uuid,
  p_name text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  previous_name text;
begin
  if current_user_id is null or not public.can_administer_organization(p_organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;
  select name into previous_name
  from public.crm_pipelines
  where organization_id = p_organization_id and id = p_pipeline_id and not is_archived
  for update;
  if not found then raise exception 'pipeline not found in organization' using errcode = 'P0002'; end if;

  update public.crm_pipelines
  set name = nullif(btrim(p_name), '')
  where organization_id = p_organization_id and id = p_pipeline_id;

  insert into public.audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    p_organization_id, current_user_id, 'crm.pipeline_renamed', 'crm_pipeline', p_pipeline_id::text,
    jsonb_build_object('name', previous_name), jsonb_build_object('name', btrim(p_name))
  );
  return p_pipeline_id;
end;
$$;
create or replace function public.archive_crm_pipeline(
  p_organization_id uuid,
  p_pipeline_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  pipeline_record public.crm_pipelines%rowtype;
begin
  if current_user_id is null or not public.can_administer_organization(p_organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;
  select * into pipeline_record
  from public.crm_pipelines
  where organization_id = p_organization_id and id = p_pipeline_id
  for update;
  if not found then raise exception 'pipeline not found in organization' using errcode = 'P0002'; end if;
  if pipeline_record.is_default then
    raise exception 'default pipeline cannot be archived' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.crm_opportunities
    where organization_id = p_organization_id and pipeline_id = p_pipeline_id
  ) then
    raise exception 'pipeline has opportunities' using errcode = '55000';
  end if;

  update public.crm_pipelines
  set is_archived = true
  where organization_id = p_organization_id and id = p_pipeline_id;

  insert into public.audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    p_organization_id, current_user_id, 'crm.pipeline_archived', 'crm_pipeline', p_pipeline_id::text,
    jsonb_build_object('is_archived', false), jsonb_build_object('is_archived', true)
  );
  return p_pipeline_id;
end;
$$;
create or replace function public.create_crm_entry_in_pipeline(
  p_organization_id uuid,
  p_pipeline_id uuid,
  p_contact_name text,
  p_opportunity_title text,
  p_contact_company text default null,
  p_contact_email text default null,
  p_contact_phone text default null,
  p_contact_notes text default null,
  p_opportunity_stage text default 'novo',
  p_opportunity_value numeric default 0,
  p_opportunity_currency text default 'BRL',
  p_opportunity_probability smallint default 0,
  p_opportunity_expected_close_date date default null
)
returns table (contact_id uuid, opportunity_id uuid, activity_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_entry record;
begin
  if auth.uid() is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.crm_pipelines
    where organization_id = p_organization_id and id = p_pipeline_id and not is_archived
  ) then
    raise exception 'pipeline not found in organization' using errcode = '42501';
  end if;

  select * into created_entry
  from public.create_crm_entry(
    p_organization_id,
    p_contact_name,
    p_opportunity_title,
    p_contact_company,
    p_contact_email,
    p_contact_phone,
    p_contact_notes,
    p_opportunity_stage,
    p_opportunity_value,
    p_opportunity_currency,
    p_opportunity_probability,
    p_opportunity_expected_close_date
  );

  update public.crm_opportunities
  set pipeline_id = p_pipeline_id
  where organization_id = p_organization_id
    and id = created_entry.opportunity_id;

  return query select created_entry.contact_id, created_entry.opportunity_id, created_entry.activity_id;
end;
$$;
revoke all on function public.create_default_crm_pipeline() from public;
revoke all on function public.assign_and_validate_crm_pipeline() from public;
revoke all on function public.internal_crm_pipeline_limit(uuid) from public;
revoke all on function public.current_crm_pipeline_limit(uuid) from public;
revoke all on function public.enforce_crm_pipeline_plan_limit() from public;
revoke all on function public.create_crm_pipeline(uuid, text) from public;
revoke all on function public.rename_crm_pipeline(uuid, uuid, text) from public;
revoke all on function public.archive_crm_pipeline(uuid, uuid) from public;
revoke all on function public.create_crm_entry_in_pipeline(
  uuid, uuid, text, text, text, text, text, text, text, numeric, text, smallint, date
) from public;
grant execute on function public.current_crm_pipeline_limit(uuid) to authenticated;
grant execute on function public.create_crm_pipeline(uuid, text) to authenticated;
grant execute on function public.rename_crm_pipeline(uuid, uuid, text) to authenticated;
grant execute on function public.archive_crm_pipeline(uuid, uuid) to authenticated;
grant execute on function public.create_crm_entry_in_pipeline(
  uuid, uuid, text, text, text, text, text, text, text, numeric, text, smallint, date
) to authenticated;
comment on table public.crm_pipelines is
  'Named tenant-scoped pipelines that reuse the canonical eight-stage CRM flow.';
