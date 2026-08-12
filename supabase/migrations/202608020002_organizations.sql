create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_name_not_blank check (btrim(name) <> ''),
  constraint organizations_slug_format check (
    slug = lower(slug)
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and char_length(slug) between 3 and 63
  ),
  constraint organizations_slug_key unique (slug)
);
comment on table public.organizations is
  'Tenant boundary. Access is derived from organization_members, never from an unverified client tenant id.';
create index organizations_created_by_idx
  on public.organizations (created_by);
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();
create or replace function public.enforce_organization_immutable_identity()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'organization id is immutable' using errcode = '22000';
  end if;

  if new.created_by is distinct from old.created_by then
    raise exception 'organization created_by is immutable' using errcode = '22000';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'organization created_at is immutable' using errcode = '22000';
  end if;

  return new;
end;
$$;
create trigger organizations_enforce_immutable_identity
before update on public.organizations
for each row execute function public.enforce_organization_immutable_identity();
revoke all on function public.enforce_organization_immutable_identity()
  from public;
