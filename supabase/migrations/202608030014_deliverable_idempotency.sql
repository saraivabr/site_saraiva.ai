-- A saved assistant message represents one user-reviewed deliverable. Repeated
-- submissions return the same id instead of creating duplicate first wins.

alter table public.chat_deliverables
  add column source_message_id uuid references public.chat_messages (id) on delete set null;
with candidates as (
  select
    deliverable.id,
    message.id as message_id,
    row_number() over (
      partition by deliverable.organization_id, deliverable.created_by, message.id
      order by deliverable.created_at, deliverable.id
    ) as occurrence
  from public.chat_deliverables as deliverable
  join public.chat_messages as message
    on message.id::text = deliverable.content ->> 'message_id'
   and message.organization_id = deliverable.organization_id
   and message.conversation_id = deliverable.conversation_id
   and message.role = 'assistant'
)
update public.chat_deliverables as deliverable
set source_message_id = candidates.message_id
from candidates
where deliverable.id = candidates.id and candidates.occurrence = 1;
create unique index chat_deliverables_source_message_unique_idx
  on public.chat_deliverables (organization_id, created_by, source_message_id)
  where source_message_id is not null;
create or replace function public.save_chat_deliverable(
  p_organization_id uuid,
  p_conversation_id uuid,
  p_type text,
  p_title text,
  p_content jsonb,
  p_source_references jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_deliverable_id uuid;
  existing_deliverable_id uuid;
  resolved_message_id uuid;
  raw_message_id text := p_content ->> 'message_id';
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.chat_conversations
    where organization_id = p_organization_id and id = p_conversation_id
  ) then
    raise exception 'chat conversation not found in organization' using errcode = '42501';
  end if;
  if p_type not in ('diagnostic', 'plan', 'script', 'proposal', 'checklist', 'process', 'document', 'other') then
    raise exception 'invalid deliverable type' using errcode = '22023';
  end if;
  if nullif(btrim(p_title), '') is null or jsonb_typeof(p_content) not in ('object', 'array', 'string') then
    raise exception 'invalid deliverable content' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_source_references, '[]'::jsonb)) <> 'array' then
    raise exception 'invalid source references' using errcode = '22023';
  end if;
  if raw_message_id is null or raw_message_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    raise exception 'deliverable source message is required' using errcode = '22023';
  end if;

  select message.id into resolved_message_id
  from public.chat_messages as message
  where message.id = raw_message_id::uuid
    and message.organization_id = p_organization_id
    and message.conversation_id = p_conversation_id
    and message.role = 'assistant';
  if resolved_message_id is null then
    raise exception 'assistant source message not found in organization' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    p_organization_id::text || ':' || current_user_id::text || ':' || resolved_message_id::text,
    0
  ));
  select deliverable.id into existing_deliverable_id
  from public.chat_deliverables as deliverable
  where deliverable.organization_id = p_organization_id
    and deliverable.created_by = current_user_id
    and deliverable.source_message_id = resolved_message_id;
  if existing_deliverable_id is not null then
    return existing_deliverable_id;
  end if;

  insert into public.chat_deliverables (
    organization_id, conversation_id, created_by, source_message_id,
    title, type, content, status, source_references
  ) values (
    p_organization_id, p_conversation_id, current_user_id, resolved_message_id,
    left(btrim(p_title), 200), p_type, p_content, 'saved',
    coalesce(p_source_references, '[]'::jsonb)
  ) returning id into new_deliverable_id;

  if exists (
    select 1 from public.chat_messages
    where organization_id = p_organization_id
      and conversation_id = p_conversation_id
      and role = 'user'
  ) then
    update public.profiles
    set first_value_reached_at = coalesce(first_value_reached_at, statement_timestamp())
    where id = current_user_id;
  end if;

  return new_deliverable_id;
end;
$$;
revoke all on function public.save_chat_deliverable(uuid,uuid,text,text,jsonb,jsonb) from public;
grant execute on function public.save_chat_deliverable(uuid,uuid,text,text,jsonb,jsonb) to authenticated, service_role;
comment on column public.chat_deliverables.source_message_id is
  'Assistant message explicitly reviewed and saved by the user; unique per user and organization.';
