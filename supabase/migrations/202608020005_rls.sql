-- SECURITY DEFINER membership helpers deliberately expose only booleans scoped
-- to auth.uid(). An empty search_path prevents object-shadowing attacks.
create or replace function public.is_organization_member(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and target_organization_id is not null
    and exists (
      select 1
      from public.organization_members as membership
      where membership.organization_id = target_organization_id
        and membership.user_id = auth.uid()
    );
$$;
create or replace function public.can_write_organization(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and target_organization_id is not null
    and exists (
      select 1
      from public.organization_members as membership
      where membership.organization_id = target_organization_id
        and membership.user_id = auth.uid()
        and membership.role in ('owner', 'admin', 'manager', 'member')
    );
$$;
create or replace function public.can_administer_organization(
  target_organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and target_organization_id is not null
    and exists (
      select 1
      from public.organization_members as membership
      where membership.organization_id = target_organization_id
        and membership.user_id = auth.uid()
        and membership.role in ('owner', 'admin')
    );
$$;
revoke all on function public.is_organization_member(uuid) from public;
revoke all on function public.can_write_organization(uuid) from public;
revoke all on function public.can_administer_organization(uuid) from public;
grant execute on function public.is_organization_member(uuid) to authenticated;
grant execute on function public.can_write_organization(uuid) to authenticated;
grant execute on function public.can_administer_organization(uuid) to authenticated;
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_opportunities enable row level security;
alter table public.crm_activities enable row level security;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
create policy organizations_select_member
on public.organizations
for select
to authenticated
using (public.is_organization_member(id));
create policy organizations_update_admin
on public.organizations
for update
to authenticated
using (public.can_administer_organization(id))
with check (public.can_administer_organization(id));
create policy organization_members_select_member
on public.organization_members
for select
to authenticated
using (public.is_organization_member(organization_id));
create policy crm_contacts_select_member
on public.crm_contacts
for select
to authenticated
using (public.is_organization_member(organization_id));
create policy crm_contacts_insert_writer
on public.crm_contacts
for insert
to authenticated
with check (
  public.can_write_organization(organization_id)
  and created_by = auth.uid()
);
create policy crm_contacts_update_writer
on public.crm_contacts
for update
to authenticated
using (public.can_write_organization(organization_id))
with check (public.can_write_organization(organization_id));
create policy crm_contacts_delete_writer
on public.crm_contacts
for delete
to authenticated
using (public.can_write_organization(organization_id));
create policy crm_opportunities_select_member
on public.crm_opportunities
for select
to authenticated
using (public.is_organization_member(organization_id));
create policy crm_opportunities_insert_writer
on public.crm_opportunities
for insert
to authenticated
with check (
  public.can_write_organization(organization_id)
  and created_by = auth.uid()
);
create policy crm_opportunities_update_writer
on public.crm_opportunities
for update
to authenticated
using (public.can_write_organization(organization_id))
with check (public.can_write_organization(organization_id));
create policy crm_opportunities_delete_writer
on public.crm_opportunities
for delete
to authenticated
using (public.can_write_organization(organization_id));
create policy crm_activities_select_member
on public.crm_activities
for select
to authenticated
using (public.is_organization_member(organization_id));
create policy crm_activities_insert_writer
on public.crm_activities
for insert
to authenticated
with check (
  public.can_write_organization(organization_id)
  and user_id = auth.uid()
);
-- New projects created by the CLI no longer auto-grant public schema objects.
-- These explicit grants are the API contract; RLS remains the row-level gate.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.organization_members from anon, authenticated;
revoke all on table public.crm_contacts from anon, authenticated;
revoke all on table public.crm_opportunities from anon, authenticated;
revoke all on table public.crm_activities from anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, full_name, avatar_url)
  on table public.profiles to authenticated;
grant update (full_name, avatar_url)
  on table public.profiles to authenticated;
grant select on table public.organizations to authenticated;
grant update (name, slug) on table public.organizations to authenticated;
grant select on table public.organization_members to authenticated;
grant select, delete on table public.crm_contacts to authenticated;
grant insert (id, organization_id, name, company, email, phone, notes, created_by)
  on table public.crm_contacts to authenticated;
grant update (name, company, email, phone, notes)
  on table public.crm_contacts to authenticated;
grant select, delete on table public.crm_opportunities to authenticated;
grant insert (
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
) on table public.crm_opportunities to authenticated;
grant update (
  contact_id,
  title,
  stage,
  value,
  currency,
  probability,
  expected_close_date
) on table public.crm_opportunities to authenticated;
grant select on table public.crm_activities to authenticated;
grant insert (
  organization_id,
  opportunity_id,
  user_id,
  type,
  description,
  metadata
) on table public.crm_activities to authenticated;
-- Called by GoTrue in the same transaction that inserts auth.users. If both
-- organization metadata values are present, profile + tenant + owner membership
-- are created atomically. Invalid or duplicate slugs abort signup explicitly.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  organization_name text := nullif(btrim(new.raw_user_meta_data ->> 'organization_name'), '');
  organization_slug text := nullif(
    lower(btrim(new.raw_user_meta_data ->> 'organization_slug')),
    ''
  );
  profile_full_name text := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), '')
  );
  profile_avatar_url text := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'picture'), '')
  );
  new_organization_id uuid;
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, profile_full_name, profile_avatar_url)
  on conflict (id) do nothing;

  if (organization_name is null) <> (organization_slug is null) then
    raise exception 'organization_name and organization_slug must be provided together'
      using errcode = '22023';
  end if;

  if organization_name is null then
    return new;
  end if;

  if organization_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     or char_length(organization_slug) not between 3 and 63 then
    raise exception 'organization_slug must contain 3-63 lowercase letters, digits, or single hyphens'
      using errcode = '22023';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (organization_name, organization_slug, new.id)
  returning id into new_organization_id;

  insert into public.organization_members (
    organization_id,
    user_id,
    role
  )
  values (new_organization_id, new.id, 'owner');

  return new;
end;
$$;
revoke all on function public.handle_new_auth_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
-- Recovery/bootstrap RPC for an already-authenticated user whose account was
-- created without organization metadata. User/org ids are never accepted.
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
revoke all on function public.bootstrap_organization(text, text, text) from public;
grant execute on function public.bootstrap_organization(text, text, text)
  to authenticated;
