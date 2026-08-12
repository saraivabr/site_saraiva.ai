-- Legal texts remain in review until a super administrator records the
-- professional review reference and explicitly activates each version.
-- Acceptance is global to the account, versioned and never stores IP, e-mail,
-- user-agent or document bodies in the generic audit trail.

create table public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  version text not null,
  title text not null,
  canonical_path text not null,
  content_hash text not null,
  status text not null default 'review',
  activated_at timestamptz,
  activated_by uuid references auth.users (id) on delete set null,
  review_reference text,
  created_at timestamptz not null default now(),
  constraint legal_documents_type_check check (document_type in ('terms', 'privacy')),
  constraint legal_documents_version_check check (version ~ '^[0-9]+\.[0-9]+(?:\.[0-9]+)?$'),
  constraint legal_documents_title_check check (char_length(btrim(title)) between 2 and 160),
  constraint legal_documents_path_check check (canonical_path in ('/termos', '/privacidade')),
  constraint legal_documents_hash_check check (content_hash ~ '^[0-9a-f]{64}$'),
  constraint legal_documents_status_check check (status in ('review', 'active', 'superseded', 'archived')),
  constraint legal_documents_activation_check check (
    (status = 'active' and activated_at is not null and activated_by is not null and char_length(btrim(review_reference)) between 10 and 500)
    or status <> 'active'
  ),
  unique (document_type, version)
);
create unique index legal_documents_one_active_type_idx
  on public.legal_documents (document_type)
  where status = 'active';
create table public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.legal_documents (id) on delete restrict,
  source text not null,
  accepted_at timestamptz not null default now(),
  constraint legal_acceptances_source_check check (source in ('legal_gate', 'checkout')),
  unique (user_id, document_id)
);
create index legal_acceptances_user_accepted_idx
  on public.legal_acceptances (user_id, accepted_at desc);
alter table public.legal_documents enable row level security;
alter table public.legal_acceptances enable row level security;
create policy legal_documents_select_active_or_admin
on public.legal_documents for select to authenticated
using (status = 'active' or public.is_super_admin());
create policy legal_acceptances_select_own_or_admin
on public.legal_acceptances for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());
revoke all on table public.legal_documents from anon, authenticated;
revoke all on table public.legal_acceptances from anon, authenticated;
grant all on table public.legal_documents to service_role;
grant all on table public.legal_acceptances to service_role;
insert into public.legal_documents (
  document_type, version, title, canonical_path, content_hash, status
) values
  (
    'terms', '0.2', 'Termos de uso', '/termos',
    'd09c09a4bdba5445705fccdd7b9ca98ee24dcfe1af0da50cf9f14501ad59e877',
    'review'
  ),
  (
    'privacy', '0.2', 'Política de Privacidade', '/privacidade',
    'e7cd74e6d77138b438bd4ac7bed5535409c3cfa71b0dca0351d67303d2cfb51e',
    'review'
  );
create or replace function public.get_current_legal_acceptance_status()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with request_user as (
    select auth.uid() as id
  ), active_documents as (
    select
      document.id,
      document.document_type,
      document.version,
      document.title,
      document.canonical_path,
      document.content_hash,
      acceptance.accepted_at
    from public.legal_documents as document
    left join public.legal_acceptances as acceptance
      on acceptance.document_id = document.id
     and acceptance.user_id = (select id from request_user)
    where document.status = 'active'
  ), aggregate_status as (
    select
      count(*) = 2
        and count(*) filter (where document_type = 'terms') = 1
        and count(*) filter (where document_type = 'privacy') = 1 as configured,
      count(*) filter (where accepted_at is null) as missing_count,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'type', document_type,
            'version', version,
            'title', title,
            'path', canonical_path,
            'contentHash', content_hash,
            'acceptedAt', accepted_at
          ) order by document_type
        ),
        '[]'::jsonb
      ) as documents
    from active_documents
  )
  select jsonb_build_object(
    'authenticated', (select id from request_user) is not null,
    'configured', configured,
    'accepted', configured and missing_count = 0 and (select id from request_user) is not null,
    'missingCount', case when configured then missing_count else 2 end,
    'documents', documents
  )
  from aggregate_status;
$$;
create or replace function public.list_legal_documents_admin()
returns table (
  id uuid,
  document_type text,
  version text,
  title text,
  canonical_path text,
  content_hash text,
  status text,
  activated_at timestamptz,
  review_reference text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  return query
  select
    document.id,
    document.document_type,
    document.version,
    document.title,
    document.canonical_path,
    document.content_hash,
    document.status,
    document.activated_at,
    document.review_reference,
    document.created_at
  from public.legal_documents as document
  order by document.document_type, document.created_at desc;
end;
$$;
create or replace function public.accept_current_legal_documents(
  p_confirmed boolean,
  p_source text default 'legal_gate'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  active_count integer;
  inserted_record record;
begin
  if current_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if p_confirmed is not true then
    raise exception 'explicit legal confirmation is required' using errcode = '22023';
  end if;
  if p_source not in ('legal_gate', 'checkout') then
    raise exception 'invalid legal acceptance source' using errcode = '22023';
  end if;

  select count(*) into active_count
  from public.legal_documents
  where status = 'active'
    and document_type in ('terms', 'privacy');
  if active_count <> 2 then
    raise exception 'legal documents are not approved for acceptance' using errcode = 'P0001';
  end if;

  for inserted_record in
    insert into public.legal_acceptances (user_id, document_id, source)
    select current_user_id, document.id, p_source
    from public.legal_documents as document
    where document.status = 'active'
      and document.document_type in ('terms', 'privacy')
    on conflict (user_id, document_id) do nothing
    returning document_id
  loop
    insert into public.audit_logs (
      actor_user_id, action, entity_type, entity_id, new_value
    )
    select
      current_user_id,
      'legal_document.accepted',
      'legal_document',
      document.id::text,
      jsonb_build_object(
        'document_type', document.document_type,
        'version', document.version,
        'content_hash', document.content_hash,
        'source', p_source
      )
    from public.legal_documents as document
    where document.id = inserted_record.document_id;
  end loop;

  return public.get_current_legal_acceptance_status();
end;
$$;
create or replace function public.activate_legal_document_version(
  p_document_id uuid,
  p_review_reference text,
  p_confirmation text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_document public.legal_documents%rowtype;
  normalized_reference text := btrim(coalesce(p_review_reference, ''));
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_confirmation <> 'activate-reviewed-legal-version' then
    raise exception 'legal activation confirmation mismatch' using errcode = '22023';
  end if;
  if char_length(normalized_reference) not between 10 and 500 then
    raise exception 'legal review reference is required' using errcode = '22023';
  end if;

  select * into target_document
  from public.legal_documents
  where id = p_document_id
  for update;
  if not found then
    raise exception 'legal document not found' using errcode = 'P0002';
  end if;
  if target_document.status <> 'review' then
    raise exception 'only reviewed drafts can be activated' using errcode = 'P0001';
  end if;

  update public.legal_documents
  set status = 'superseded'
  where document_type = target_document.document_type
    and status = 'active';

  update public.legal_documents
  set status = 'active',
      activated_at = statement_timestamp(),
      activated_by = current_user_id,
      review_reference = normalized_reference
  where id = target_document.id;

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, new_value
  ) values (
    current_user_id,
    'legal_document.activated',
    'legal_document',
    target_document.id::text,
    jsonb_build_object(
      'document_type', target_document.document_type,
      'version', target_document.version,
      'content_hash', target_document.content_hash,
      'review_reference_recorded', true
    )
  );
  return target_document.id;
end;
$$;
revoke all on function public.get_current_legal_acceptance_status() from public;
revoke all on function public.list_legal_documents_admin() from public;
revoke all on function public.accept_current_legal_documents(boolean, text) from public;
revoke all on function public.activate_legal_document_version(uuid, text, text) from public;
grant execute on function public.get_current_legal_acceptance_status() to authenticated;
grant execute on function public.list_legal_documents_admin() to authenticated;
grant execute on function public.accept_current_legal_documents(boolean, text) to authenticated;
grant execute on function public.activate_legal_document_version(uuid, text, text) to authenticated;
comment on table public.legal_documents is
  'Versioned legal catalog. Review rows do not become acceptable until explicit super-admin activation.';
comment on table public.legal_acceptances is
  'Account-level acceptance ledger without IP, e-mail, user-agent or document body.';
