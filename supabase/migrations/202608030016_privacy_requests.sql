-- Data-subject requests are first-party, tenant-scoped and auditable without
-- copying request details into analytics or the generic audit trail.

create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_type text not null,
  details text,
  status text not null default 'submitted',
  resolution_note text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  constraint privacy_requests_type_check check (request_type in (
    'confirmation', 'access', 'correction', 'export', 'deletion',
    'restriction', 'opposition', 'automated_review'
  )),
  constraint privacy_requests_status_check check (status in (
    'submitted', 'in_review', 'completed', 'rejected'
  )),
  constraint privacy_requests_details_check check (details is null or char_length(details) <= 2000),
  constraint privacy_requests_resolution_check check (resolution_note is null or char_length(resolution_note) <= 2000)
);
create index privacy_requests_user_requested_idx
  on public.privacy_requests (user_id, requested_at desc);
create index privacy_requests_status_requested_idx
  on public.privacy_requests (status, requested_at);
alter table public.privacy_requests enable row level security;
create policy privacy_requests_select_owner_or_admin
on public.privacy_requests for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());
revoke all on table public.privacy_requests from anon, authenticated;
grant select on table public.privacy_requests to authenticated;
grant all on table public.privacy_requests to service_role;
create or replace function public.submit_privacy_request(
  p_organization_id uuid,
  p_request_type text,
  p_details text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  request_id uuid;
  normalized_details text := nullif(btrim(coalesce(p_details, '')), '');
begin
  if current_user_id is null or not public.is_organization_member(p_organization_id) then
    raise exception 'privacy request access denied' using errcode = '42501';
  end if;
  if p_request_type not in (
    'confirmation', 'access', 'correction', 'export', 'deletion',
    'restriction', 'opposition', 'automated_review'
  ) then
    raise exception 'invalid privacy request type' using errcode = '22023';
  end if;
  if normalized_details is not null and char_length(normalized_details) > 2000 then
    raise exception 'privacy request details too long' using errcode = '22023';
  end if;
  if (
    select count(*)
    from public.privacy_requests
    where user_id = current_user_id
      and status in ('submitted', 'in_review')
      and requested_at > statement_timestamp() - interval '24 hours'
  ) >= 5 then
    raise exception 'privacy request rate limit reached' using errcode = 'P0001';
  end if;

  insert into public.privacy_requests (
    user_id, organization_id, request_type, details
  ) values (
    current_user_id, p_organization_id, p_request_type, normalized_details
  ) returning id into request_id;

  insert into public.audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id, new_value
  ) values (
    p_organization_id,
    current_user_id,
    'privacy_request.submitted',
    'privacy_request',
    request_id::text,
    jsonb_build_object('request_type', p_request_type, 'status', 'submitted')
  );
  return request_id;
end;
$$;
create or replace function public.review_privacy_request(
  p_request_id uuid,
  p_status text,
  p_resolution_note text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  request_record public.privacy_requests%rowtype;
  normalized_note text := nullif(btrim(coalesce(p_resolution_note, '')), '');
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_status not in ('in_review', 'completed', 'rejected') then
    raise exception 'invalid privacy request status' using errcode = '22023';
  end if;
  if normalized_note is not null and char_length(normalized_note) > 2000 then
    raise exception 'privacy resolution note too long' using errcode = '22023';
  end if;

  select * into request_record
  from public.privacy_requests
  where id = p_request_id
  for update;
  if not found then
    raise exception 'privacy request not found' using errcode = 'P0002';
  end if;

  update public.privacy_requests
  set status = p_status,
      resolution_note = normalized_note,
      reviewed_at = statement_timestamp(),
      reviewed_by = current_user_id
  where id = p_request_id;

  insert into public.audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id,
    previous_value, new_value
  ) values (
    request_record.organization_id,
    current_user_id,
    'privacy_request.reviewed',
    'privacy_request',
    p_request_id::text,
    jsonb_build_object('status', request_record.status),
    jsonb_build_object('status', p_status)
  );
  return p_status;
end;
$$;
revoke all on function public.submit_privacy_request(uuid, text, text) from public;
revoke all on function public.review_privacy_request(uuid, text, text) from public;
grant execute on function public.submit_privacy_request(uuid, text, text) to authenticated;
grant execute on function public.review_privacy_request(uuid, text, text) to authenticated;
comment on table public.privacy_requests is
  'Authenticated data-subject requests; details never enter analytics or generic audit values.';
