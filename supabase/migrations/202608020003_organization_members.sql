create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations (id) on delete cascade,
  user_id uuid not null
    references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint organization_members_role_check check (
    role in ('owner', 'admin', 'manager', 'member', 'viewer')
  ),
  constraint organization_members_organization_user_key
    unique (organization_id, user_id)
);
comment on table public.organization_members is
  'Database-backed tenant membership and role assignment.';
create index organization_members_user_id_idx
  on public.organization_members (user_id, organization_id);
create index organization_members_organization_role_idx
  on public.organization_members (organization_id, role);
