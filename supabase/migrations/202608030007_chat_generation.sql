-- Generation claims combine monthly limits, rate limiting, message persistence
-- and idempotency under one tenant-scoped database lock.

alter table public.chat_deliverables drop constraint chat_deliverables_status_check;
alter table public.chat_deliverables add constraint chat_deliverables_status_check
  check (status in ('draft', 'saved', 'review', 'approved', 'archived'));
create table public.chat_generation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  conversation_id uuid not null,
  user_message_id uuid not null,
  assistant_message_id uuid,
  idempotency_key uuid not null,
  status text not null default 'started',
  model text not null,
  provider_response_id text,
  capabilities_used jsonb not null default '[]'::jsonb,
  sources_used jsonb not null default '[]'::jsonb,
  tools_used jsonb not null default '[]'::jsonb,
  validation_result text not null default 'prepared',
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_micros bigint not null default 0,
  latency_ms integer,
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint chat_generation_runs_conversation_fkey foreign key (organization_id, conversation_id)
    references public.chat_conversations (organization_id, id) on delete cascade,
  constraint chat_generation_runs_user_message_fkey foreign key (user_message_id)
    references public.chat_messages (id) on delete cascade,
  constraint chat_generation_runs_assistant_message_fkey foreign key (assistant_message_id)
    references public.chat_messages (id) on delete set null,
  constraint chat_generation_runs_status_check check (status in ('started', 'completed', 'failed')),
  constraint chat_generation_runs_arrays_check check (jsonb_typeof(capabilities_used) = 'array' and jsonb_typeof(sources_used) = 'array' and jsonb_typeof(tools_used) = 'array'),
  constraint chat_generation_runs_validation_check check (validation_result in ('prepared', 'approved', 'needs_context', 'blocked', 'failed')),
  constraint chat_generation_runs_usage_check check (input_tokens >= 0 and output_tokens >= 0 and estimated_cost_micros >= 0 and (latency_ms is null or latency_ms >= 0)),
  constraint chat_generation_runs_idempotency unique (organization_id, idempotency_key),
  constraint chat_generation_runs_user_message_unique unique (user_message_id)
);
create index chat_generation_runs_usage_idx
  on public.chat_generation_runs (organization_id, user_id, created_at desc);
alter table public.chat_generation_runs enable row level security;
create policy chat_generation_runs_select_member
on public.chat_generation_runs for select to authenticated
using (public.is_organization_member(organization_id));
revoke all on table public.chat_generation_runs from anon, authenticated;
grant select on table public.chat_generation_runs to authenticated;
grant all on table public.chat_generation_runs to service_role;
create or replace function public.start_chat_generation(
  p_organization_id uuid,
  p_conversation_id uuid,
  p_message text,
  p_idempotency_key uuid,
  p_metadata jsonb,
  p_model text,
  p_capabilities_used jsonb,
  p_sources_used jsonb,
  p_tools_used jsonb
)
returns table (
  conversation_id uuid,
  message_id uuid,
  generation_run_id uuid,
  claim_status text,
  limit_value integer,
  current_usage integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_message text := nullif(btrim(p_message), '');
  selected_plan_id text := 'free';
  plan_limit integer;
  usage_count integer;
  active_run_count integer;
  recent_run_count integer;
  resolved_conversation_id uuid;
  resolved_message_id uuid;
  resolved_run_id uuid;
  existing_status text;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if normalized_message is null or char_length(normalized_message) > 12000
     or p_idempotency_key is null or nullif(btrim(p_model), '') is null then
    raise exception 'invalid chat generation request' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_capabilities_used, '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_sources_used, '[]'::jsonb)) <> 'array'
     or jsonb_typeof(coalesce(p_tools_used, '[]'::jsonb)) <> 'array' then
    raise exception 'invalid generation audit arrays' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_organization_id::text, 0));

  select message.id, message.conversation_id, run.id, run.status
  into resolved_message_id, resolved_conversation_id, resolved_run_id, existing_status
  from public.chat_messages as message
  left join public.chat_generation_runs as run on run.user_message_id = message.id
  where message.organization_id = p_organization_id
    and message.created_by = current_user_id
    and message.idempotency_key = p_idempotency_key;

  if resolved_run_id is not null then
    return query select resolved_conversation_id, resolved_message_id, resolved_run_id,
      'duplicate_' || existing_status, null::integer, null::integer;
    return;
  end if;

  select subscription.plan_id
  into selected_plan_id
  from public.subscriptions as subscription
  where subscription.organization_id = p_organization_id
    and subscription.access_state in ('active', 'grace_period')
  order by subscription.updated_at desc
  limit 1;
  selected_plan_id := coalesce(selected_plan_id, 'free');
  select plan.chat_interaction_limit into plan_limit from public.plans as plan where plan.id = selected_plan_id;

  select coalesce(sum(record.quantity), 0)::integer
  into usage_count
  from public.usage_records as record
  where record.organization_id = p_organization_id
    and record.feature = 'chat_interaction'
    and record.period_start = date_trunc('month', statement_timestamp())::date;

  select count(*)::integer into active_run_count
  from public.chat_generation_runs as run
  where run.organization_id = p_organization_id and run.status = 'started';

  if usage_count + active_run_count >= plan_limit then
    return query select null::uuid, null::uuid, null::uuid, 'limit_reached', plan_limit, usage_count;
    return;
  end if;

  select count(*)::integer into recent_run_count
  from public.chat_generation_runs as run
  where run.user_id = current_user_id
    and run.created_at >= statement_timestamp() - interval '1 minute';
  if recent_run_count >= 10 then
    return query select null::uuid, null::uuid, null::uuid, 'rate_limited', plan_limit, usage_count;
    return;
  end if;

  if p_conversation_id is null then
    insert into public.chat_conversations (organization_id, created_by, title)
    values (p_organization_id, current_user_id, left(normalized_message, 80))
    returning id into resolved_conversation_id;
  else
    select id into resolved_conversation_id
    from public.chat_conversations
    where organization_id = p_organization_id and id = p_conversation_id;
    if resolved_conversation_id is null then
      raise exception 'chat conversation not found in organization' using errcode = '42501';
    end if;
  end if;

  insert into public.chat_messages (
    organization_id, conversation_id, created_by, role, content, idempotency_key, metadata
  ) values (
    p_organization_id, resolved_conversation_id, current_user_id, 'user',
    normalized_message, p_idempotency_key, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into resolved_message_id;

  insert into public.chat_generation_runs (
    organization_id, user_id, conversation_id, user_message_id,
    idempotency_key, model, capabilities_used, sources_used, tools_used
  ) values (
    p_organization_id, current_user_id, resolved_conversation_id,
    resolved_message_id, p_idempotency_key, btrim(p_model),
    coalesce(p_capabilities_used, '[]'::jsonb), coalesce(p_sources_used, '[]'::jsonb),
    coalesce(p_tools_used, '[]'::jsonb)
  ) returning id into resolved_run_id;

  update public.chat_conversations set updated_at = statement_timestamp()
  where organization_id = p_organization_id and id = resolved_conversation_id;

  return query select resolved_conversation_id, resolved_message_id, resolved_run_id,
    'started', plan_limit, usage_count;
end;
$$;
create or replace function public.complete_chat_generation(
  p_generation_run_id uuid,
  p_answer text,
  p_metadata jsonb,
  p_provider_response_id text,
  p_input_tokens integer,
  p_output_tokens integer,
  p_estimated_cost_micros bigint,
  p_latency_ms integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  run_row public.chat_generation_runs%rowtype;
  new_message_id uuid;
begin
  select * into run_row from public.chat_generation_runs where id = p_generation_run_id for update;
  if run_row.id is null then raise exception 'generation run not found' using errcode = 'P0002'; end if;
  if run_row.status = 'completed' then return run_row.assistant_message_id; end if;
  if run_row.status <> 'started' then raise exception 'generation run is not active' using errcode = '55000'; end if;
  if nullif(btrim(p_answer), '') is null or char_length(p_answer) > 12000 then
    raise exception 'invalid assistant answer' using errcode = '22023';
  end if;

  insert into public.chat_messages (organization_id, conversation_id, created_by, role, content, metadata)
  values (run_row.organization_id, run_row.conversation_id, run_row.user_id, 'assistant', btrim(p_answer), coalesce(p_metadata, '{}'::jsonb))
  returning id into new_message_id;

  insert into public.usage_records (
    organization_id, user_id, feature, period_start, quantity, input_tokens,
    output_tokens, estimated_cost_micros, model, idempotency_key
  ) values (
    run_row.organization_id, run_row.user_id, 'chat_interaction',
    date_trunc('month', statement_timestamp())::date, 1,
    greatest(coalesce(p_input_tokens, 0), 0), greatest(coalesce(p_output_tokens, 0), 0),
    greatest(coalesce(p_estimated_cost_micros, 0), 0), run_row.model, run_row.user_message_id
  ) on conflict (organization_id, feature, idempotency_key) do nothing;

  update public.chat_generation_runs
  set status = 'completed', validation_result = 'approved', assistant_message_id = new_message_id,
      provider_response_id = p_provider_response_id,
      input_tokens = greatest(coalesce(p_input_tokens, 0), 0),
      output_tokens = greatest(coalesce(p_output_tokens, 0), 0),
      estimated_cost_micros = greatest(coalesce(p_estimated_cost_micros, 0), 0),
      latency_ms = greatest(coalesce(p_latency_ms, 0), 0),
      completed_at = statement_timestamp()
  where id = p_generation_run_id;

  update public.chat_conversations set updated_at = statement_timestamp()
  where organization_id = run_row.organization_id and id = run_row.conversation_id;
  return new_message_id;
end;
$$;
create or replace function public.fail_chat_generation(
  p_generation_run_id uuid,
  p_error_code text,
  p_latency_ms integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.chat_generation_runs
  set status = 'failed', validation_result = 'failed', error_code = left(coalesce(nullif(btrim(p_error_code), ''), 'generation_failed'), 120),
      latency_ms = greatest(coalesce(p_latency_ms, 0), 0), completed_at = statement_timestamp()
  where id = p_generation_run_id and status = 'started';
end;
$$;
revoke all on function public.start_chat_generation(uuid, uuid, text, uuid, jsonb, text, jsonb, jsonb, jsonb) from public;
revoke all on function public.complete_chat_generation(uuid, text, jsonb, text, integer, integer, bigint, integer) from public;
revoke all on function public.fail_chat_generation(uuid, text, integer) from public;
grant execute on function public.start_chat_generation(uuid, uuid, text, uuid, jsonb, text, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.complete_chat_generation(uuid, text, jsonb, text, integer, integer, bigint, integer) to service_role;
grant execute on function public.fail_chat_generation(uuid, text, integer) to service_role;
