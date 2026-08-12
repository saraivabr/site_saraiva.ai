create table public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations (id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_contacts_name_not_blank check (btrim(name) <> ''),
  constraint crm_contacts_company_not_blank
    check (company is null or btrim(company) <> ''),
  constraint crm_contacts_email_not_blank
    check (email is null or btrim(email) <> ''),
  constraint crm_contacts_phone_not_blank
    check (phone is null or btrim(phone) <> ''),
  constraint crm_contacts_organization_id_id_key
    unique (organization_id, id)
);
create table public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations (id) on delete cascade,
  contact_id uuid,
  title text not null,
  stage text not null default 'novo',
  value numeric(14, 2) not null default 0,
  currency text not null default 'BRL',
  probability smallint not null default 0,
  expected_close_date date,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_opportunities_contact_id_fkey
    foreign key (organization_id, contact_id)
    references public.crm_contacts (organization_id, id)
    on delete set null (contact_id),
  constraint crm_opportunities_title_not_blank check (btrim(title) <> ''),
  constraint crm_opportunities_stage_check check (
    stage in (
      'novo',
      'contato',
      'qualificado',
      'diagnostico',
      'proposta',
      'negociacao',
      'ganho',
      'perdido'
    )
  ),
  constraint crm_opportunities_value_nonnegative check (value >= 0),
  constraint crm_opportunities_currency_format check (
    currency ~ '^[A-Z]{3}$'
  ),
  constraint crm_opportunities_probability_range check (
    probability between 0 and 100
  ),
  constraint crm_opportunities_organization_id_id_key
    unique (organization_id, id)
);
create table public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations (id) on delete cascade,
  opportunity_id uuid not null,
  user_id uuid not null references auth.users (id) on delete restrict,
  type text not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint crm_activities_opportunity_id_fkey
    foreign key (organization_id, opportunity_id)
    references public.crm_opportunities (organization_id, id)
    on delete cascade,
  constraint crm_activities_type_not_blank check (btrim(type) <> ''),
  constraint crm_activities_description_not_blank
    check (btrim(description) <> ''),
  constraint crm_activities_metadata_object
    check (jsonb_typeof(metadata) = 'object')
);
create index crm_contacts_organization_name_idx
  on public.crm_contacts (organization_id, name);
create index crm_contacts_organization_created_at_idx
  on public.crm_contacts (organization_id, created_at desc);
create index crm_opportunities_organization_stage_idx
  on public.crm_opportunities (organization_id, stage);
create index crm_opportunities_organization_expected_close_idx
  on public.crm_opportunities (organization_id, expected_close_date)
  where expected_close_date is not null;
create index crm_opportunities_contact_id_idx
  on public.crm_opportunities (contact_id)
  where contact_id is not null;
create index crm_activities_organization_created_at_idx
  on public.crm_activities (organization_id, created_at desc);
create index crm_activities_opportunity_created_at_idx
  on public.crm_activities (opportunity_id, created_at desc);
create trigger crm_contacts_set_updated_at
before update on public.crm_contacts
for each row execute function public.set_updated_at();
create trigger crm_opportunities_set_updated_at
before update on public.crm_opportunities
for each row execute function public.set_updated_at();
create or replace function public.enforce_crm_immutable_ownership()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.organization_id is distinct from old.organization_id then
    raise exception 'organization_id is immutable'
      using errcode = '22000';
  end if;

  if new.created_by is distinct from old.created_by then
    raise exception 'created_by is immutable'
      using errcode = '22000';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'created_at is immutable'
      using errcode = '22000';
  end if;

  return new;
end;
$$;
create trigger crm_contacts_enforce_immutable_ownership
before update on public.crm_contacts
for each row execute function public.enforce_crm_immutable_ownership();
create trigger crm_opportunities_enforce_immutable_ownership
before update on public.crm_opportunities
for each row execute function public.enforce_crm_immutable_ownership();
revoke all on function public.enforce_crm_immutable_ownership() from public;
