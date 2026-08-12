-- Editorial review is a server-validated, audited transition. Imported content
-- remains in review until a global administrator explicitly publishes it.

create policy profiles_super_admin_select
on public.profiles for select to authenticated
using (public.is_super_admin());
create policy organizations_super_admin_select
on public.organizations for select to authenticated
using (public.is_super_admin());
create policy organization_members_super_admin_select
on public.organization_members for select to authenticated
using (public.is_super_admin());
create policy subscriptions_super_admin_select
on public.subscriptions for select to authenticated
using (public.is_super_admin());
create or replace function public.review_library_resource(
  p_resource_id uuid,
  p_title text,
  p_description text,
  p_author text,
  p_ownership_status text,
  p_required_plan text,
  p_content text,
  p_instructions text,
  p_action text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  previous_metadata jsonb;
  next_status text;
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_action not in ('review', 'publish', 'archive') then
    raise exception 'invalid editorial action' using errcode = '22023';
  end if;
  if nullif(btrim(p_title), '') is null
     or nullif(btrim(p_description), '') is null
     or nullif(btrim(p_author), '') is null
     or nullif(btrim(p_content), '') is null then
    raise exception 'incomplete editorial content' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;
  if p_action = 'publish' and p_ownership_status = 'unconfirmed' then
    raise exception 'unconfirmed ownership cannot be published' using errcode = '22023';
  end if;

  select jsonb_build_object(
    'title', title,
    'author', author,
    'ownership_status', ownership_status,
    'editorial_status', editorial_status,
    'required_plan', required_plan
  )
  into previous_metadata
  from public.library_resources
  where id = p_resource_id
  for update;

  if previous_metadata is null then
    raise exception 'library resource not found' using errcode = 'P0002';
  end if;

  next_status := case
    when p_action = 'publish' then 'published'
    when p_action = 'archive' then 'archived'
    else 'review'
  end;

  update public.library_resources
  set title = left(btrim(p_title), 200),
      description = left(btrim(p_description), 2000),
      author = left(btrim(p_author), 200),
      ownership_status = p_ownership_status,
      required_plan = p_required_plan,
      editorial_status = next_status,
      reviewed_at = case when p_action = 'publish' then statement_timestamp() else reviewed_at end,
      reviewed_by = case when p_action = 'publish' then current_user_id else reviewed_by end,
      published_at = case when p_action = 'publish' then coalesce(published_at, statement_timestamp()) else published_at end
  where id = p_resource_id;

  insert into public.library_resource_contents (resource_id, content, instructions)
  values (
    p_resource_id,
    btrim(p_content),
    nullif(btrim(coalesce(p_instructions, '')), '')
  ) on conflict (resource_id) do update
  set content = excluded.content,
      instructions = excluded.instructions;

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value
  ) values (
    current_user_id,
    'library_resource.' || p_action,
    'library_resource',
    p_resource_id::text,
    previous_metadata,
    jsonb_build_object(
      'title', left(btrim(p_title), 200),
      'author', left(btrim(p_author), 200),
      'ownership_status', p_ownership_status,
      'editorial_status', next_status,
      'required_plan', p_required_plan,
      'content_updated', true
    )
  );

  return next_status;
end;
$$;
revoke all on function public.review_library_resource(uuid, text, text, text, text, text, text, text, text) from public;
grant execute on function public.review_library_resource(uuid, text, text, text, text, text, text, text, text) to authenticated;
comment on function public.review_library_resource is
  'Explicit super-admin editorial transition with provenance fields and content-safe audit metadata.';
