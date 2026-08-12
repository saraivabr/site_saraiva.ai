-- CRM integrity hardening and transactional write boundary.
-- Authenticated clients keep RLS-protected reads, but all writes go through
-- SECURITY DEFINER functions that derive the actor from auth.uid().

alter table public.crm_opportunities
  alter column contact_id set not null;
alter table public.crm_opportunities
  drop constraint crm_opportunities_contact_id_fkey,
  add constraint crm_opportunities_contact_id_fkey
    foreign key (organization_id, contact_id)
    references public.crm_contacts (organization_id, id)
    on delete restrict;
alter table public.crm_contacts
  add constraint crm_contacts_name_max_length
    check (char_length(name) <= 160),
  add constraint crm_contacts_company_max_length
    check (company is null or char_length(company) <= 2000),
  add constraint crm_contacts_phone_max_length
    check (phone is null or char_length(phone) <= 2000),
  add constraint crm_contacts_notes_max_length
    check (notes is null or char_length(notes) <= 2000);
alter table public.crm_opportunities
  add constraint crm_opportunities_title_max_length
    check (char_length(title) <= 200);
create index crm_contacts_created_by_idx
  on public.crm_contacts (created_by);
create index crm_opportunities_created_by_idx
  on public.crm_opportunities (created_by);
create index crm_activities_user_id_idx
  on public.crm_activities (user_id);
-- Locking the authenticated user's row serializes concurrent bootstrap calls.
-- The membership check happens after the lock and before any write, while the
-- function call itself is one PostgreSQL transaction statement.
create or replace function public.bootstrap_organization(
  organization_name text,
  organization_slug text,
  profile_full_name text default null
)
returns table (
  organization_id uuid,
  slug text,
  member_role text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_name text := nullif(btrim(organization_name), '');
  normalized_slug text := nullif(lower(btrim(organization_slug)), '');
  normalized_full_name text := nullif(btrim(profile_full_name), '');
  new_organization_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  perform 1
  from auth.users as auth_user
  where auth_user.id = current_user_id
  for update;

  if not found then
    raise exception 'authenticated user does not exist' using errcode = '42501';
  end if;

  if exists (
    select 1
    from public.organization_members as membership
    where membership.user_id = current_user_id
  ) then
    raise exception 'user already belongs to an organization'
      using errcode = '55000';
  end if;

  if normalized_name is null then
    raise exception 'organization_name is required' using errcode = '22023';
  end if;

  if normalized_slug is null
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     or char_length(normalized_slug) not between 3 and 63 then
    raise exception 'organization_slug must contain 3-63 lowercase letters, digits, or single hyphens'
      using errcode = '22023';
  end if;

  insert into public.profiles (id, full_name)
  values (current_user_id, normalized_full_name)
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name);

  insert into public.organizations (name, slug, created_by)
  values (normalized_name, normalized_slug, current_user_id)
  returning id into new_organization_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (new_organization_id, current_user_id, 'owner');

  return query
  select new_organization_id, normalized_slug, 'owner'::text;
end;
$$;
comment on function public.bootstrap_organization(text, text, text) is
  'Atomically creates the first organization for auth.uid(); serialized by an auth.users row lock.';
create or replace function public.create_crm_entry(
  p_organization_id uuid,
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
returns table (
  contact_id uuid,
  opportunity_id uuid,
  activity_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_contact_name text := nullif(btrim(p_contact_name), '');
  normalized_contact_company text := nullif(btrim(p_contact_company), '');
  normalized_contact_email text := nullif(lower(btrim(p_contact_email)), '');
  normalized_contact_phone text := nullif(btrim(p_contact_phone), '');
  normalized_contact_notes text := nullif(btrim(p_contact_notes), '');
  normalized_opportunity_title text := nullif(btrim(p_opportunity_title), '');
  normalized_opportunity_stage text := nullif(lower(btrim(p_opportunity_stage)), '');
  normalized_opportunity_currency text := nullif(upper(btrim(p_opportunity_currency)), '');
  new_contact_id uuid;
  new_opportunity_id uuid;
  new_activity_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;

  insert into public.crm_contacts (
    organization_id,
    name,
    company,
    email,
    phone,
    notes,
    created_by
  )
  values (
    p_organization_id,
    normalized_contact_name,
    normalized_contact_company,
    normalized_contact_email,
    normalized_contact_phone,
    normalized_contact_notes,
    current_user_id
  )
  returning id into new_contact_id;

  insert into public.crm_opportunities (
    organization_id,
    contact_id,
    title,
    stage,
    value,
    currency,
    probability,
    expected_close_date,
    created_by
  )
  values (
    p_organization_id,
    new_contact_id,
    normalized_opportunity_title,
    normalized_opportunity_stage,
    p_opportunity_value,
    normalized_opportunity_currency,
    p_opportunity_probability,
    p_opportunity_expected_close_date,
    current_user_id
  )
  returning id into new_opportunity_id;

  insert into public.crm_activities (
    organization_id,
    opportunity_id,
    user_id,
    type,
    description,
    metadata
  )
  values (
    p_organization_id,
    new_opportunity_id,
    current_user_id,
    'created',
    'Oportunidade criada',
    jsonb_build_object(
      'stage', normalized_opportunity_stage,
      'value', p_opportunity_value
    )
  )
  returning id into new_activity_id;

  return query
  select new_contact_id, new_opportunity_id, new_activity_id;
end;
$$;
comment on function public.create_crm_entry(
  uuid, text, text, text, text, text, text, text, numeric, text, smallint, date
) is
  'Atomically creates a contact, opportunity, and created activity for auth.uid().';
create or replace function public.update_crm_opportunity_with_activity(
  p_organization_id uuid,
  p_opportunity_id uuid,
  p_title text default null,
  p_stage text default null,
  p_value numeric default null,
  p_currency text default null,
  p_probability smallint default null,
  p_expected_close_date date default null,
  p_expected_close_date_is_set boolean default false
)
returns table (
  opportunity_id uuid,
  activity_id uuid,
  activity_type text,
  activity_description text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  locked_opportunity public.crm_opportunities%rowtype;
  normalized_title text := nullif(btrim(p_title), '');
  normalized_stage text := nullif(lower(btrim(p_stage)), '');
  normalized_currency text := nullif(upper(btrim(p_currency)), '');
  updated_stage text;
  new_activity_id uuid;
  new_activity_type text;
  new_activity_description text;
  new_activity_metadata jsonb;
  changed_fields text[] := array[]::text[];
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;

  if p_title is null
     and p_stage is null
     and p_value is null
     and p_currency is null
     and p_probability is null
     and not coalesce(p_expected_close_date_is_set, false) then
    raise exception 'at least one opportunity field is required'
      using errcode = '22023';
  end if;

  select opportunity.*
  into locked_opportunity
  from public.crm_opportunities as opportunity
  where opportunity.organization_id = p_organization_id
    and opportunity.id = p_opportunity_id
  for update;

  if not found then
    raise exception 'CRM opportunity not found in organization'
      using errcode = 'P0002';
  end if;

  if p_title is not null then
    changed_fields := array_append(changed_fields, 'title');
  end if;
  if p_stage is not null then
    changed_fields := array_append(changed_fields, 'stage');
  end if;
  if p_value is not null then
    changed_fields := array_append(changed_fields, 'value');
  end if;
  if p_currency is not null then
    changed_fields := array_append(changed_fields, 'currency');
  end if;
  if p_probability is not null then
    changed_fields := array_append(changed_fields, 'probability');
  end if;
  if coalesce(p_expected_close_date_is_set, false) then
    changed_fields := array_append(changed_fields, 'expected_close_date');
  end if;

  update public.crm_opportunities as opportunity
  set
    title = case when p_title is null then opportunity.title else normalized_title end,
    stage = case when p_stage is null then opportunity.stage else normalized_stage end,
    value = coalesce(p_value, opportunity.value),
    currency = case when p_currency is null then opportunity.currency else normalized_currency end,
    probability = coalesce(p_probability, opportunity.probability),
    expected_close_date = case
      when coalesce(p_expected_close_date_is_set, false)
        then p_expected_close_date
      else opportunity.expected_close_date
    end
  where opportunity.organization_id = p_organization_id
    and opportunity.id = p_opportunity_id
  returning opportunity.stage into updated_stage;

  if updated_stage is distinct from locked_opportunity.stage then
    new_activity_type := 'stage_changed';
    new_activity_description := format(
      'Etapa alterada de %s para %s',
      case locked_opportunity.stage
        when 'novo' then 'Novo'
        when 'contato' then 'Contato'
        when 'qualificado' then 'Qualificado'
        when 'diagnostico' then 'Diagnóstico'
        when 'proposta' then 'Proposta'
        when 'negociacao' then 'Negociação'
        when 'ganho' then 'Ganho'
        when 'perdido' then 'Perdido'
      end,
      case updated_stage
        when 'novo' then 'Novo'
        when 'contato' then 'Contato'
        when 'qualificado' then 'Qualificado'
        when 'diagnostico' then 'Diagnóstico'
        when 'proposta' then 'Proposta'
        when 'negociacao' then 'Negociação'
        when 'ganho' then 'Ganho'
        when 'perdido' then 'Perdido'
      end
    );
    new_activity_metadata := jsonb_build_object(
      'from', locked_opportunity.stage,
      'to', updated_stage
    );
  else
    new_activity_type := 'updated';
    new_activity_description := 'Oportunidade atualizada';
    new_activity_metadata := jsonb_build_object(
      'fields', to_jsonb(changed_fields)
    );
  end if;

  insert into public.crm_activities (
    organization_id,
    opportunity_id,
    user_id,
    type,
    description,
    metadata
  )
  values (
    p_organization_id,
    p_opportunity_id,
    current_user_id,
    new_activity_type,
    new_activity_description,
    new_activity_metadata
  )
  returning id into new_activity_id;

  return query
  select
    p_opportunity_id,
    new_activity_id,
    new_activity_type,
    new_activity_description;
end;
$$;
comment on function public.update_crm_opportunity_with_activity(
  uuid, uuid, text, text, numeric, text, smallint, date, boolean
) is
  'Locks and updates one in-scope opportunity, then records its activity atomically for auth.uid().';
create or replace function public.delete_crm_opportunity(
  p_organization_id uuid,
  p_opportunity_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  deleted_opportunity_id uuid;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;

  delete from public.crm_opportunities as opportunity
  where opportunity.organization_id = p_organization_id
    and opportunity.id = p_opportunity_id
  returning opportunity.id into deleted_opportunity_id;

  if deleted_opportunity_id is null then
    raise exception 'CRM opportunity not found in organization'
      using errcode = 'P0002';
  end if;

  return deleted_opportunity_id;
end;
$$;
comment on function public.delete_crm_opportunity(uuid, uuid) is
  'Deletes exactly one in-scope opportunity and returns its id for auth.uid().';
-- Remove both table-level and the earlier column-level write grants. Policies
-- remain enabled as defense in depth and continue governing SELECT access.
revoke all privileges on table public.crm_contacts from anon, authenticated;
revoke insert (
  id, organization_id, name, company, email, phone, notes, created_by
) on table public.crm_contacts from authenticated;
revoke update (
  name, company, email, phone, notes
) on table public.crm_contacts from authenticated;
revoke all privileges on table public.crm_opportunities from anon, authenticated;
revoke insert (
  id,
  organization_id,
  contact_id,
  title,
  stage,
  value,
  currency,
  probability,
  expected_close_date,
  created_by
) on table public.crm_opportunities from authenticated;
revoke update (
  contact_id,
  title,
  stage,
  value,
  currency,
  probability,
  expected_close_date
) on table public.crm_opportunities from authenticated;
revoke all privileges on table public.crm_activities from anon, authenticated;
revoke insert (
  organization_id,
  opportunity_id,
  user_id,
  type,
  description,
  metadata
) on table public.crm_activities from authenticated;
grant select on table public.crm_contacts to authenticated;
grant select on table public.crm_opportunities to authenticated;
grant select on table public.crm_activities to authenticated;
revoke all on function public.bootstrap_organization(text, text, text)
  from public, anon, authenticated;
grant execute on function public.bootstrap_organization(text, text, text)
  to authenticated;
revoke all on function public.create_crm_entry(
  uuid, text, text, text, text, text, text, text, numeric, text, smallint, date
) from public, anon, authenticated;
grant execute on function public.create_crm_entry(
  uuid, text, text, text, text, text, text, text, numeric, text, smallint, date
) to authenticated;
revoke all on function public.update_crm_opportunity_with_activity(
  uuid, uuid, text, text, numeric, text, smallint, date, boolean
) from public, anon, authenticated;
grant execute on function public.update_crm_opportunity_with_activity(
  uuid, uuid, text, text, numeric, text, smallint, date, boolean
) to authenticated;
revoke all on function public.delete_crm_opportunity(uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.delete_crm_opportunity(uuid, uuid)
  to authenticated;
