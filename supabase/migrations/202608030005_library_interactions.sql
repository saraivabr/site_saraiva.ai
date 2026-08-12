-- Authenticated interaction writes are exposed through narrow functions so
-- history cannot be forged for another user, organization or locked resource.

create or replace function public.record_library_view(
  p_organization_id uuid,
  p_resource_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  required_plan_value text;
  history_id uuid;
begin
  if current_user_id is null or not public.is_organization_member(p_organization_id) then
    raise exception 'library history access denied' using errcode = '42501';
  end if;

  select required_plan
  into required_plan_value
  from public.library_resources
  where id = p_resource_id and editorial_status = 'published';

  if required_plan_value is null
     or not public.can_access_content(required_plan_value, p_organization_id) then
    raise exception 'library resource access denied' using errcode = '42501';
  end if;

  insert into public.library_history (organization_id, user_id, resource_id)
  values (p_organization_id, current_user_id, p_resource_id)
  returning id into history_id;

  return history_id;
end;
$$;
revoke all on function public.record_library_view(uuid, uuid) from public;
grant execute on function public.record_library_view(uuid, uuid) to authenticated;
comment on function public.record_library_view is
  'Records an authenticated view only after tenant membership, publication and entitlement checks.';
