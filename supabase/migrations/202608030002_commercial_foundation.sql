-- Commercial foundation: onboarding, plans, subscriptions, usage and first-party events.
-- Provider webhooks and server-only writes use the service role; browser clients
-- never receive direct write grants for billing or analytics ledgers.

alter table public.profiles
  add column intent text,
  add column global_role text not null default 'user',
  add column onboarding_completed_at timestamptz,
  add column first_value_reached_at timestamptz,
  add constraint profiles_intent_check
    check (intent is null or intent in ('apply_to_company', 'sell_solutions')),
  add constraint profiles_global_role_check
    check (global_role in ('user', 'super_admin'));
alter table public.organizations
  add column segment text,
  add column main_goal text,
  add column current_challenge text,
  add constraint organizations_segment_check
    check (segment is null or (btrim(segment) <> '' and char_length(segment) <= 120)),
  add constraint organizations_main_goal_check
    check (main_goal is null or (btrim(main_goal) <> '' and char_length(main_goal) <= 500)),
  add constraint organizations_current_challenge_check
    check (current_challenge is null or (btrim(current_challenge) <> '' and char_length(current_challenge) <= 1000));
alter table public.chat_deliverables
  drop constraint chat_deliverables_status_check;
update public.chat_deliverables
set status = case
  when status = 'approved' then 'saved'
  when status = 'review' then 'draft'
  else status
end;
alter table public.chat_deliverables
  add column source_references jsonb not null default '[]'::jsonb,
  add constraint chat_deliverables_status_check check (status in ('draft', 'saved', 'archived')),
  add constraint chat_deliverables_source_references_check check (jsonb_typeof(source_references) = 'array');
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = auth.uid()
      and profile.global_role = 'super_admin'
  );
$$;
revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to anon, authenticated;
create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null default 'member',
  token_hash text not null unique,
  invited_by uuid not null references auth.users (id) on delete restrict,
  accepted_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint organization_invitations_email_check check (email = lower(btrim(email)) and btrim(email) <> ''),
  constraint organization_invitations_role_check check (role in ('admin', 'manager', 'member', 'viewer')),
  constraint organization_invitations_expiry_check check (expires_at > created_at)
);
create unique index organization_invitations_active_email_idx
  on public.organization_invitations (organization_id, email)
  where accepted_at is null and revoked_at is null;
create table public.plans (
  id text primary key,
  catalog_version text not null,
  name text not null,
  description text not null,
  active boolean not null default true,
  checkout_enabled boolean not null default false,
  price_in_cents integer,
  billing_interval text,
  seat_limit integer not null,
  chat_interaction_limit integer not null,
  contact_limit integer not null,
  opportunity_limit integer not null,
  pipeline_limit integer not null,
  content_access text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_id_check check (id in ('free', 'pro_founder_monthly', 'pro_founder_annual', 'enterprise')),
  constraint plans_price_check check (price_in_cents is null or price_in_cents >= 0),
  constraint plans_interval_check check (billing_interval is null or billing_interval in ('month', 'year')),
  constraint plans_limits_check check (
    seat_limit > 0 and chat_interaction_limit >= 0 and contact_limit >= 0
    and opportunity_limit >= 0 and pipeline_limit > 0
  ),
  constraint plans_content_access_check check (content_access in ('open', 'complete'))
);
create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();
create table public.plan_entitlements (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null references public.plans (id) on delete cascade,
  entitlement_key text not null,
  enabled boolean not null default true,
  limit_value integer,
  created_at timestamptz not null default now(),
  constraint plan_entitlements_key_check check (btrim(entitlement_key) <> ''),
  constraint plan_entitlements_limit_check check (limit_value is null or limit_value >= 0),
  constraint plan_entitlements_plan_key unique (plan_id, entitlement_key)
);
create table public.stripe_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stripe_customers_id_check check (btrim(stripe_customer_id) <> '')
);
create trigger stripe_customers_set_updated_at
before update on public.stripe_customers
for each row execute function public.set_updated_at();
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id text not null references public.plans (id) on delete restrict,
  provider text not null default 'stripe',
  provider_subscription_id text unique,
  provider_status text not null,
  access_state text not null default 'free',
  current_period_start timestamptz,
  current_period_end timestamptz,
  grace_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_provider_check check (provider in ('stripe', 'contract')),
  constraint subscriptions_provider_status_check check (
    provider_status in ('free', 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired')
  ),
  constraint subscriptions_access_state_check check (
    access_state in ('free', 'active', 'grace_period', 'restricted', 'cancelled')
  )
);
create unique index subscriptions_current_organization_idx
  on public.subscriptions (organization_id)
  where access_state in ('active', 'grace_period');
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();
create table public.billing_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'stripe',
  provider_event_id text not null unique,
  event_type text not null,
  organization_id uuid references public.organizations (id) on delete set null,
  payload_hash text not null,
  processing_status text not null default 'received',
  processed_at timestamptz,
  error_code text,
  created_at timestamptz not null default now(),
  constraint billing_events_provider_check check (provider = 'stripe'),
  constraint billing_events_status_check check (processing_status in ('received', 'processed', 'ignored', 'failed')),
  constraint billing_events_payload_hash_check check (btrim(payload_hash) <> '')
);
create table public.usage_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null,
  period_start date not null,
  quantity integer not null default 1,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_micros bigint not null default 0,
  model text,
  attachment_count integer not null default 0,
  tool_count integer not null default 0,
  idempotency_key uuid not null,
  created_at timestamptz not null default now(),
  constraint usage_records_feature_check check (feature in ('chat_interaction', 'chat_tokens', 'attachment', 'tool_call')),
  constraint usage_records_nonnegative_check check (
    quantity >= 0 and input_tokens >= 0 and output_tokens >= 0
    and estimated_cost_micros >= 0 and attachment_count >= 0 and tool_count >= 0
  ),
  constraint usage_records_idempotency unique (organization_id, feature, idempotency_key)
);
create index usage_records_period_idx
  on public.usage_records (organization_id, feature, period_start);
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  anonymous_id uuid,
  event_name text not null,
  source_app text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint analytics_events_name_check check (event_name in (
    'sign_up_completed', 'onboarding_started', 'onboarding_completed',
    'first_chat_message_sent', 'first_value_reached', 'resource_viewed',
    'resource_favorited', 'lesson_started', 'lesson_completed',
    'experiment_viewed', 'contact_created', 'opportunity_created',
    'usage_limit_reached', 'upgrade_started', 'checkout_started',
    'subscription_activated', 'subscription_cancelled'
  )),
  constraint analytics_events_source_check check (btrim(source_app) <> '')
);
create index analytics_events_name_occurred_idx
  on public.analytics_events (event_name, occurred_at desc);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_check check (btrim(action) <> ''),
  constraint audit_logs_entity_check check (btrim(entity_type) <> '' and btrim(entity_id) <> '')
);
insert into public.plans (
  id, catalog_version, name, description, active, checkout_enabled,
  price_in_cents, billing_interval, seat_limit, chat_interaction_limit,
  contact_limit, opportunity_limit, pipeline_limit, content_access
) values
  ('free', '2026-08-founder-v1', 'Gratuito', 'Conta permanente com limites iniciais.', true, false, 0, null, 1, 15, 20, 5, 1, 'open'),
  ('pro_founder_monthly', '2026-08-founder-v1', 'Pro Fundador', 'Acesso completo ao MVP.', true, true, 19700, 'month', 3, 1000, 1000, 1000, 3, 'complete'),
  ('pro_founder_annual', '2026-08-founder-v1', 'Pro Fundador Anual', 'Acesso completo ao MVP por doze meses.', true, true, 197000, 'year', 3, 1000, 1000, 1000, 3, 'complete'),
  ('enterprise', '2026-08-founder-v1', 'Empresa', 'Implantação e limites por contrato.', true, false, null, null, 5, 1000, 1000, 1000, 3, 'complete');
insert into public.plan_entitlements (plan_id, entitlement_key, enabled, limit_value)
select plan.id, entitlement.key, entitlement.enabled, entitlement.limit_value
from public.plans as plan
cross join lateral (
  values
    ('chat.interactions.monthly', true, plan.chat_interaction_limit),
    ('crm.contacts', true, plan.contact_limit),
    ('crm.opportunities', true, plan.opportunity_limit),
    ('crm.pipelines', true, plan.pipeline_limit),
    ('organization.seats', true, plan.seat_limit),
    ('content.complete', plan.content_access = 'complete', null::integer)
) as entitlement(key, enabled, limit_value);
alter table public.organization_invitations enable row level security;
alter table public.plans enable row level security;
alter table public.plan_entitlements enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;
alter table public.usage_records enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;
create policy organization_invitations_select_admin
on public.organization_invitations for select to authenticated
using (public.can_administer_organization(organization_id));
create policy plans_read_catalog
on public.plans for select to anon, authenticated
using (active);
create policy plan_entitlements_read_catalog
on public.plan_entitlements for select to anon, authenticated
using (exists (select 1 from public.plans where plans.id = plan_id and plans.active));
create policy stripe_customers_select_admin
on public.stripe_customers for select to authenticated
using (public.can_administer_organization(organization_id));
create policy subscriptions_select_member
on public.subscriptions for select to authenticated
using (public.is_organization_member(organization_id));
create policy usage_records_select_member
on public.usage_records for select to authenticated
using (public.is_organization_member(organization_id));
create policy analytics_events_select_super_admin
on public.analytics_events for select to authenticated
using (public.is_super_admin());
create policy audit_logs_select_authorized
on public.audit_logs for select to authenticated
using (
  public.is_super_admin()
  or (organization_id is not null and public.can_administer_organization(organization_id))
);
revoke all on table public.organization_invitations from anon, authenticated;
revoke all on table public.plans from anon, authenticated;
revoke all on table public.plan_entitlements from anon, authenticated;
revoke all on table public.stripe_customers from anon, authenticated;
revoke all on table public.subscriptions from anon, authenticated;
revoke all on table public.billing_events from anon, authenticated;
revoke all on table public.usage_records from anon, authenticated;
revoke all on table public.analytics_events from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;
grant select on table public.plans to anon, authenticated;
grant select on table public.plan_entitlements to anon, authenticated;
grant select on table public.organization_invitations to authenticated;
grant select on table public.stripe_customers to authenticated;
grant select on table public.subscriptions to authenticated;
grant select on table public.usage_records to authenticated;
grant select on table public.analytics_events to authenticated;
grant select on table public.audit_logs to authenticated;
grant all on table public.organization_invitations, public.plans,
  public.plan_entitlements, public.stripe_customers, public.subscriptions,
  public.billing_events, public.usage_records, public.analytics_events,
  public.audit_logs to service_role;
comment on table public.billing_events is
  'Idempotent Stripe event ledger. Payloads are not stored; only a cryptographic hash and safe processing metadata.';
comment on table public.analytics_events is
  'First-party product events without conversation text, CRM PII, secrets, tokens or files.';
create or replace function public.complete_onboarding(
  p_organization_id uuid,
  p_intent text,
  p_organization_name text,
  p_segment text,
  p_main_goal text,
  p_current_challenge text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or not public.can_administer_organization(p_organization_id) then
    raise exception 'organization administration denied' using errcode = '42501';
  end if;
  if p_intent not in ('apply_to_company', 'sell_solutions') then
    raise exception 'invalid onboarding intent' using errcode = '22023';
  end if;
  if nullif(btrim(p_organization_name), '') is null
     or nullif(btrim(p_segment), '') is null
     or nullif(btrim(p_main_goal), '') is null
     or nullif(btrim(p_current_challenge), '') is null then
    raise exception 'onboarding context is incomplete' using errcode = '22023';
  end if;

  update public.organizations
  set name = left(btrim(p_organization_name), 160),
      segment = left(btrim(p_segment), 120),
      main_goal = left(btrim(p_main_goal), 500),
      current_challenge = left(btrim(p_current_challenge), 1000)
  where id = p_organization_id;

  update public.profiles
  set intent = p_intent,
      onboarding_completed_at = coalesce(onboarding_completed_at, statement_timestamp())
  where id = current_user_id;
end;
$$;
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

  insert into public.chat_deliverables (
    organization_id, conversation_id, created_by, title, type, content, status, source_references
  ) values (
    p_organization_id, p_conversation_id, current_user_id, left(btrim(p_title), 200),
    p_type, p_content, 'saved', coalesce(p_source_references, '[]'::jsonb)
  ) returning id into new_deliverable_id;

  if exists (
    select 1 from public.chat_messages
    where organization_id = p_organization_id
      and conversation_id = p_conversation_id
      and role = 'user'
  ) and exists (
    select 1 from public.chat_messages
    where organization_id = p_organization_id
      and conversation_id = p_conversation_id
      and role = 'assistant'
  ) then
    update public.profiles
    set first_value_reached_at = coalesce(first_value_reached_at, statement_timestamp())
    where id = current_user_id;
  end if;

  return new_deliverable_id;
end;
$$;
revoke all on function public.complete_onboarding(uuid, text, text, text, text, text) from public;
revoke all on function public.save_chat_deliverable(uuid, uuid, text, text, jsonb, jsonb) from public;
grant execute on function public.complete_onboarding(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.save_chat_deliverable(uuid, uuid, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.complete_onboarding(uuid, text, text, text, text, text) to service_role;
grant execute on function public.save_chat_deliverable(uuid, uuid, text, text, jsonb, jsonb) to service_role;
