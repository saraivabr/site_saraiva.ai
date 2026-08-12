-- Secure, seat-limited invitations for the paid team promise. Raw invitation
-- tokens never reach the database: clients submit only a SHA-256 digest.

create or replace function public.internal_organization_seat_limit(
  p_organization_id uuid
)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select plan.seat_limit
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
create or replace function public.current_organization_seat_limit(
  p_organization_id uuid
)
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

  return public.internal_organization_seat_limit(p_organization_id);
end;
$$;
create or replace function public.create_organization_invitation(
  p_organization_id uuid,
  p_email text,
  p_role text,
  p_token_hash text,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_email text := lower(btrim(coalesce(p_email, '')));
  normalized_role text := lower(btrim(coalesce(p_role, '')));
  normalized_hash text := lower(btrim(coalesce(p_token_hash, '')));
  existing_invitation public.organization_invitations%rowtype;
  invitation_id uuid;
  allowed_seats integer;
  member_count integer;
  reserved_count integer;
  already_reserved boolean := false;
begin
  if current_user_id is null or not public.can_administer_organization(p_organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;

  if char_length(normalized_email) not between 3 and 320
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid invitation email' using errcode = '22023';
  end if;

  if normalized_role not in ('admin', 'manager', 'member', 'viewer') then
    raise exception 'invalid invitation role' using errcode = '22023';
  end if;

  if normalized_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid invitation token hash' using errcode = '22023';
  end if;

  if p_expires_at <= statement_timestamp()
     or p_expires_at > statement_timestamp() + interval '30 days' then
    raise exception 'invalid invitation expiry' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_organization_id::text, 180018)
  );

  if exists (
    select 1
    from public.organization_members as membership
    join auth.users as invited_user on invited_user.id = membership.user_id
    where membership.organization_id = p_organization_id
      and lower(invited_user.email) = normalized_email
  ) then
    raise exception 'user is already an organization member' using errcode = '23505';
  end if;

  select invitation.*
  into existing_invitation
  from public.organization_invitations as invitation
  where invitation.organization_id = p_organization_id
    and invitation.email = normalized_email
    and invitation.accepted_at is null
    and invitation.revoked_at is null
  for update;

  already_reserved := found and existing_invitation.expires_at > statement_timestamp();
  allowed_seats := public.internal_organization_seat_limit(p_organization_id);

  select count(*)::integer
  into member_count
  from public.organization_members as membership
  where membership.organization_id = p_organization_id;

  select count(*)::integer
  into reserved_count
  from public.organization_invitations as invitation
  where invitation.organization_id = p_organization_id
    and invitation.accepted_at is null
    and invitation.revoked_at is null
    and invitation.expires_at > statement_timestamp();

  if not already_reserved and member_count + reserved_count >= allowed_seats then
    raise exception 'organization seat limit reached' using errcode = 'P0001';
  end if;

  if existing_invitation.id is not null then
    update public.organization_invitations
    set role = normalized_role,
        token_hash = normalized_hash,
        expires_at = p_expires_at,
        invited_by = current_user_id,
        created_at = statement_timestamp()
    where id = existing_invitation.id
    returning id into invitation_id;
  else
    insert into public.organization_invitations (
      organization_id,
      email,
      role,
      token_hash,
      invited_by,
      expires_at
    ) values (
      p_organization_id,
      normalized_email,
      normalized_role,
      normalized_hash,
      current_user_id,
      p_expires_at
    )
    returning id into invitation_id;
  end if;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    new_value
  ) values (
    p_organization_id,
    current_user_id,
    case when existing_invitation.id is null then 'organization_invitation.created' else 'organization_invitation.renewed' end,
    'organization_invitation',
    invitation_id::text,
    jsonb_build_object('role', normalized_role, 'expires_at', p_expires_at)
  );

  return invitation_id;
end;
$$;
create or replace function public.get_organization_invitation(
  p_token_hash text
)
returns table (
  organization_id uuid,
  organization_name text,
  invited_email text,
  invited_role text,
  expires_at timestamptz,
  invitation_status text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  invitation public.organization_invitations%rowtype;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if lower(btrim(coalesce(p_token_hash, ''))) !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid invitation token' using errcode = '22023';
  end if;

  select lower(auth_user.email)
  into current_email
  from auth.users as auth_user
  where auth_user.id = current_user_id;

  select candidate.*
  into invitation
  from public.organization_invitations as candidate
  where candidate.token_hash = lower(btrim(p_token_hash));

  if invitation.id is null then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;

  if current_email is null or current_email <> invitation.email then
    raise exception 'invitation email mismatch' using errcode = '42501';
  end if;

  return query
  select
    organization.id,
    organization.name,
    invitation.email,
    invitation.role,
    invitation.expires_at,
    case
      when invitation.accepted_at is not null then 'accepted'
      when invitation.revoked_at is not null then 'revoked'
      when invitation.expires_at <= statement_timestamp() then 'expired'
      else 'active'
    end
  from public.organizations as organization
  where organization.id = invitation.organization_id;
end;
$$;
create or replace function public.accept_organization_invitation(
  p_token_hash text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  invitation public.organization_invitations%rowtype;
  allowed_seats integer;
  member_count integer;
  invitation_owner_intent text;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if lower(btrim(coalesce(p_token_hash, ''))) !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid invitation token' using errcode = '22023';
  end if;

  select lower(auth_user.email)
  into current_email
  from auth.users as auth_user
  where auth_user.id = current_user_id;

  select candidate.*
  into invitation
  from public.organization_invitations as candidate
  where candidate.token_hash = lower(btrim(p_token_hash))
  for update;

  if invitation.id is null then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;

  if current_email is null or current_email <> invitation.email then
    raise exception 'invitation email mismatch' using errcode = '42501';
  end if;

  if invitation.accepted_at is not null then
    if invitation.accepted_by = current_user_id then
      return invitation.organization_id;
    end if;
    raise exception 'invitation already accepted' using errcode = 'P0001';
  end if;

  if invitation.revoked_at is not null then
    raise exception 'invitation revoked' using errcode = 'P0001';
  end if;

  if invitation.expires_at <= statement_timestamp() then
    raise exception 'invitation expired' using errcode = 'P0001';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(invitation.organization_id::text, 180018)
  );

  if not exists (
    select 1
    from public.organization_members as membership
    where membership.organization_id = invitation.organization_id
      and membership.user_id = current_user_id
  ) then
    allowed_seats := public.internal_organization_seat_limit(invitation.organization_id);

    select count(*)::integer
    into member_count
    from public.organization_members as membership
    where membership.organization_id = invitation.organization_id;

    if member_count >= allowed_seats then
      raise exception 'organization seat limit reached' using errcode = 'P0001';
    end if;

    insert into public.organization_members (organization_id, user_id, role)
    values (invitation.organization_id, current_user_id, invitation.role);
  end if;

  update public.organization_invitations
  set accepted_by = current_user_id,
      accepted_at = statement_timestamp()
  where id = invitation.id;

  select profile.intent
  into invitation_owner_intent
  from public.profiles as profile
  where profile.id = invitation.invited_by;

  update public.profiles
  set intent = coalesce(intent, invitation_owner_intent, 'apply_to_company'),
      onboarding_completed_at = coalesce(onboarding_completed_at, statement_timestamp())
  where id = current_user_id;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    new_value
  ) values (
    invitation.organization_id,
    current_user_id,
    'organization_invitation.accepted',
    'organization_invitation',
    invitation.id::text,
    jsonb_build_object('role', invitation.role, 'member_user_id', current_user_id)
  );

  return invitation.organization_id;
end;
$$;
create or replace function public.revoke_organization_invitation(
  p_invitation_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  invitation public.organization_invitations%rowtype;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select candidate.*
  into invitation
  from public.organization_invitations as candidate
  where candidate.id = p_invitation_id
  for update;

  if invitation.id is null then
    raise exception 'invitation not found' using errcode = 'P0002';
  end if;

  if current_user_id is null or not public.can_administer_organization(invitation.organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;

  if invitation.accepted_at is not null then
    raise exception 'accepted invitation cannot be revoked' using errcode = 'P0001';
  end if;

  update public.organization_invitations
  set revoked_at = coalesce(revoked_at, statement_timestamp())
  where id = invitation.id;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id
  ) values (
    invitation.organization_id,
    current_user_id,
    'organization_invitation.revoked',
    'organization_invitation',
    invitation.id::text
  );
end;
$$;
-- Even organization administrators do not receive password-equivalent token
-- hashes through the Data API. The acceptance functions remain the only path.
revoke select on table public.organization_invitations from authenticated;
grant select (
  id,
  organization_id,
  email,
  role,
  invited_by,
  accepted_by,
  expires_at,
  accepted_at,
  revoked_at,
  created_at
) on table public.organization_invitations to authenticated;
revoke all on function public.internal_organization_seat_limit(uuid) from public;
revoke all on function public.current_organization_seat_limit(uuid) from public;
revoke all on function public.create_organization_invitation(uuid,text,text,text,timestamptz) from public;
revoke all on function public.get_organization_invitation(text) from public;
revoke all on function public.accept_organization_invitation(text) from public;
revoke all on function public.revoke_organization_invitation(uuid) from public;
grant execute on function public.current_organization_seat_limit(uuid) to authenticated;
grant execute on function public.create_organization_invitation(uuid,text,text,text,timestamptz) to authenticated;
grant execute on function public.get_organization_invitation(text) to authenticated;
grant execute on function public.accept_organization_invitation(text) to authenticated;
grant execute on function public.revoke_organization_invitation(uuid) to authenticated;
comment on function public.create_organization_invitation(uuid,text,text,text,timestamptz) is
  'Creates or renews a seat-reserving invitation after role, plan and organization authorization checks.';
comment on function public.accept_organization_invitation(text) is
  'Atomically verifies recipient email, expiry and seat capacity before adding a tenant membership.';
