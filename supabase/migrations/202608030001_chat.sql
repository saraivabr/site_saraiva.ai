-- Persistent conversation boundary for the single Chat Saraiva.AI interface.
-- The client never chooses an internal capability and cannot write assistant
-- messages. Authenticated user messages are inserted through transactional RPCs.

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  created_by uuid not null references auth.users (id) on delete restrict,
  title text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_conversations_title_not_blank check (btrim(title) <> ''),
  constraint chat_conversations_title_max_length check (char_length(title) <= 160),
  constraint chat_conversations_status_check check (status in ('open', 'archived')),
  constraint chat_conversations_tenant_identity unique (organization_id, id)
);
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null,
  created_by uuid not null references auth.users (id) on delete restrict,
  role text not null,
  content text not null,
  idempotency_key uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint chat_messages_conversation_tenant_fkey
    foreign key (organization_id, conversation_id)
    references public.chat_conversations (organization_id, id)
    on delete cascade,
  constraint chat_messages_role_check check (role in ('user', 'assistant', 'tool')),
  constraint chat_messages_content_not_blank check (btrim(content) <> ''),
  constraint chat_messages_content_max_length check (char_length(content) <= 12000),
  constraint chat_messages_idempotency_key
    unique (organization_id, created_by, idempotency_key)
);
create table public.chat_deliverables (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid,
  created_by uuid not null references auth.users (id) on delete restrict,
  title text not null,
  type text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_deliverables_conversation_tenant_fkey
    foreign key (organization_id, conversation_id)
    references public.chat_conversations (organization_id, id)
    on delete restrict,
  constraint chat_deliverables_title_not_blank check (btrim(title) <> ''),
  constraint chat_deliverables_status_check check (status in ('draft', 'review', 'approved', 'archived'))
);
create index chat_conversations_organization_updated_idx
  on public.chat_conversations (organization_id, updated_at desc);
create index chat_messages_conversation_created_idx
  on public.chat_messages (organization_id, conversation_id, created_at);
create index chat_deliverables_organization_created_idx
  on public.chat_deliverables (organization_id, created_at desc);
create trigger chat_conversations_set_updated_at
before update on public.chat_conversations
for each row execute function public.set_updated_at();
create trigger chat_deliverables_set_updated_at
before update on public.chat_deliverables
for each row execute function public.set_updated_at();
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_deliverables enable row level security;
create policy chat_conversations_select_member
on public.chat_conversations for select to authenticated
using (public.is_organization_member(organization_id));
create policy chat_messages_select_member
on public.chat_messages for select to authenticated
using (public.is_organization_member(organization_id));
create policy chat_deliverables_select_member
on public.chat_deliverables for select to authenticated
using (public.is_organization_member(organization_id));
revoke all on table public.chat_conversations from anon, authenticated;
revoke all on table public.chat_messages from anon, authenticated;
revoke all on table public.chat_deliverables from anon, authenticated;
grant select on table public.chat_conversations to authenticated;
grant select on table public.chat_messages to authenticated;
grant select on table public.chat_deliverables to authenticated;
create or replace function public.create_chat_conversation(
  p_organization_id uuid,
  p_message text,
  p_idempotency_key uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns table (conversation_id uuid, message_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_message text := nullif(btrim(p_message), '');
  existing_conversation_id uuid;
  existing_message_id uuid;
  new_conversation_id uuid;
  new_message_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if normalized_message is null or char_length(normalized_message) > 12000 then
    raise exception 'chat message is invalid' using errcode = '22023';
  end if;
  if p_idempotency_key is null then
    raise exception 'idempotency key is required' using errcode = '22023';
  end if;

  select message.conversation_id, message.id
    into existing_conversation_id, existing_message_id
  from public.chat_messages as message
  where message.organization_id = p_organization_id
    and message.created_by = current_user_id
    and message.idempotency_key = p_idempotency_key;

  if found then
    return query select existing_conversation_id, existing_message_id;
    return;
  end if;

  insert into public.chat_conversations (organization_id, created_by, title)
  values (p_organization_id, current_user_id, left(normalized_message, 80))
  returning id into new_conversation_id;

  insert into public.chat_messages (
    organization_id, conversation_id, created_by, role, content, idempotency_key, metadata
  ) values (
    p_organization_id,
    new_conversation_id,
    current_user_id,
    'user',
    normalized_message,
    p_idempotency_key,
    coalesce(p_metadata, '{}'::jsonb)
  ) returning id into new_message_id;

  return query select new_conversation_id, new_message_id;
end;
$$;
create or replace function public.append_chat_message(
  p_organization_id uuid,
  p_conversation_id uuid,
  p_message text,
  p_idempotency_key uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_message text := nullif(btrim(p_message), '');
  existing_message_id uuid;
  new_message_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if normalized_message is null or char_length(normalized_message) > 12000 then
    raise exception 'chat message is invalid' using errcode = '22023';
  end if;
  if p_idempotency_key is null then
    raise exception 'idempotency key is required' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.chat_conversations as conversation
    where conversation.organization_id = p_organization_id
      and conversation.id = p_conversation_id
  ) then
    raise exception 'chat conversation not found in organization' using errcode = '42501';
  end if;

  select message.id into existing_message_id
  from public.chat_messages as message
  where message.organization_id = p_organization_id
    and message.created_by = current_user_id
    and message.idempotency_key = p_idempotency_key;
  if found then return existing_message_id; end if;

  insert into public.chat_messages (
    organization_id, conversation_id, created_by, role, content, idempotency_key, metadata
  ) values (
    p_organization_id,
    p_conversation_id,
    current_user_id,
    'user',
    normalized_message,
    p_idempotency_key,
    coalesce(p_metadata, '{}'::jsonb)
  ) returning id into new_message_id;

  update public.chat_conversations
  set updated_at = statement_timestamp()
  where organization_id = p_organization_id and id = p_conversation_id;

  return new_message_id;
end;
$$;
revoke all on function public.create_chat_conversation(uuid, text, uuid, jsonb) from public;
revoke all on function public.append_chat_message(uuid, uuid, text, uuid, jsonb) from public;
grant execute on function public.create_chat_conversation(uuid, text, uuid, jsonb) to authenticated;
grant execute on function public.append_chat_message(uuid, uuid, text, uuid, jsonb) to authenticated;
comment on table public.chat_conversations is
  'Tenant-scoped conversations for the single Chat Saraiva.AI interface.';
comment on column public.chat_messages.metadata is
  'Server-generated orchestration audit only; never trusts client system instructions.';
