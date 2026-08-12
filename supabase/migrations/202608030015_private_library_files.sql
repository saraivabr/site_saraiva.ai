-- Private editorial files are linked to published Library resources. Storage
-- object bytes are managed only through the Storage API; this migration owns
-- authorization and the audited metadata transition.

create or replace function public.can_access_library_file(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.library_resources as resource
    where resource.file_path = object_name
      and resource.editorial_status = 'published'
      and (
        resource.required_plan = 'free'
        or public.is_super_admin()
        or exists (
          select 1
          from public.organization_members as membership
          where membership.user_id = auth.uid()
            and public.has_complete_content_access(membership.organization_id)
        )
      )
  );
$$;
revoke all on function public.can_access_library_file(text) from public;
grant execute on function public.can_access_library_file(text) to anon, authenticated, service_role;
create policy library_private_objects_select
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'library-private'
  and public.can_access_library_file(name)
);
create or replace function public.set_library_resource_file(
  p_resource_id uuid,
  p_file_path text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  previous_file_path text;
  normalized_file_path text := nullif(btrim(coalesce(p_file_path, '')), '');
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  if normalized_file_path is not null and (
    char_length(normalized_file_path) > 500
    or normalized_file_path not like p_resource_id::text || '/%'
    or position('..' in normalized_file_path) > 0
    or position(chr(92) in normalized_file_path) > 0
  ) then
    raise exception 'invalid library file path' using errcode = '22023';
  end if;

  select file_path into previous_file_path
  from public.library_resources
  where id = p_resource_id
  for update;

  if not found then
    raise exception 'library resource not found' using errcode = 'P0002';
  end if;

  update public.library_resources
  set file_path = normalized_file_path
  where id = p_resource_id;

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value
  ) values (
    current_user_id,
    case when normalized_file_path is null
      then 'library_resource.file_removed'
      else 'library_resource.file_attached'
    end,
    'library_resource',
    p_resource_id::text,
    jsonb_build_object('file_path', previous_file_path),
    jsonb_build_object('file_path', normalized_file_path)
  );

  return previous_file_path;
end;
$$;
revoke all on function public.set_library_resource_file(uuid, text) from public;
grant execute on function public.set_library_resource_file(uuid, text) to authenticated;
comment on function public.can_access_library_file(text) is
  'Authorizes only files attached to published content and never trusts an organization preference header.';
comment on function public.set_library_resource_file(uuid, text) is
  'Audited super-admin transition for attaching or removing a private Library object path.';
