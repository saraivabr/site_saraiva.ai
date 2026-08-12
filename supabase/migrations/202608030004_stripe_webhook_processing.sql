-- Stripe webhook processing is kept inside one database transaction. Browser
-- redirects never grant access and duplicate provider events are no-ops.

alter table public.subscriptions
  add constraint subscriptions_organization_unique unique (organization_id);
create or replace function public.record_stripe_billing_event(
  p_provider_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_processing_status text,
  p_organization_id uuid default null,
  p_error_code text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_count integer;
begin
  if p_processing_status not in ('received', 'processed', 'ignored', 'failed') then
    raise exception 'invalid processing status' using errcode = '22023';
  end if;
  if nullif(btrim(p_provider_event_id), '') is null
     or nullif(btrim(p_event_type), '') is null
     or nullif(btrim(p_payload_hash), '') is null then
    raise exception 'invalid billing event metadata' using errcode = '22023';
  end if;

  insert into public.billing_events (
    provider_event_id,
    event_type,
    organization_id,
    payload_hash,
    processing_status,
    processed_at,
    error_code
  ) values (
    p_provider_event_id,
    p_event_type,
    p_organization_id,
    p_payload_hash,
    p_processing_status,
    case when p_processing_status = 'received' then null else statement_timestamp() end,
    p_error_code
  ) on conflict (provider_event_id) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count = 1;
end;
$$;
create or replace function public.process_stripe_subscription_event(
  p_provider_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_organization_id uuid,
  p_plan_id text,
  p_stripe_customer_id text,
  p_provider_subscription_id text,
  p_provider_status text,
  p_current_period_start timestamptz,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_inserted boolean;
  computed_access_state text;
  computed_grace_period_end timestamptz;
begin
  if p_provider_status not in (
    'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired'
  ) then
    raise exception 'unsupported Stripe subscription status' using errcode = '22023';
  end if;
  if not exists (select 1 from public.organizations where id = p_organization_id) then
    raise exception 'unknown billing organization' using errcode = '23503';
  end if;
  if p_plan_id not in ('pro_founder_monthly', 'pro_founder_annual', 'enterprise')
     or not exists (select 1 from public.plans where id = p_plan_id and active) then
    raise exception 'unknown or inactive billing plan' using errcode = '23503';
  end if;
  if nullif(btrim(p_stripe_customer_id), '') is null
     or nullif(btrim(p_provider_subscription_id), '') is null then
    raise exception 'missing Stripe identifiers' using errcode = '22023';
  end if;

  event_inserted := public.record_stripe_billing_event(
    p_provider_event_id,
    p_event_type,
    p_payload_hash,
    'received',
    p_organization_id,
    null
  );
  if not event_inserted then
    return 'duplicate';
  end if;

  computed_access_state := case
    when p_provider_status in ('active', 'trialing') then 'active'
    when p_provider_status = 'past_due' then 'grace_period'
    when p_provider_status = 'canceled'
      and p_current_period_end is not null
      and p_current_period_end > statement_timestamp() then 'active'
    when p_provider_status = 'canceled' then 'cancelled'
    else 'restricted'
  end;

  if p_provider_status = 'past_due' then
    select case
      when grace_period_end > statement_timestamp() then grace_period_end
      else statement_timestamp() + interval '7 days'
    end
    into computed_grace_period_end
    from public.subscriptions
    where organization_id = p_organization_id;

    computed_grace_period_end := coalesce(
      computed_grace_period_end,
      statement_timestamp() + interval '7 days'
    );
  end if;

  insert into public.stripe_customers (organization_id, stripe_customer_id)
  values (p_organization_id, p_stripe_customer_id)
  on conflict (organization_id) do update
  set stripe_customer_id = excluded.stripe_customer_id;

  insert into public.subscriptions (
    organization_id,
    plan_id,
    provider,
    provider_subscription_id,
    provider_status,
    access_state,
    current_period_start,
    current_period_end,
    grace_period_end,
    cancel_at_period_end,
    cancelled_at
  ) values (
    p_organization_id,
    p_plan_id,
    'stripe',
    p_provider_subscription_id,
    p_provider_status,
    computed_access_state,
    p_current_period_start,
    p_current_period_end,
    computed_grace_period_end,
    p_cancel_at_period_end,
    case when p_provider_status = 'canceled' then statement_timestamp() else null end
  ) on conflict (organization_id) do update
  set plan_id = excluded.plan_id,
      provider = 'stripe',
      provider_subscription_id = excluded.provider_subscription_id,
      provider_status = excluded.provider_status,
      access_state = excluded.access_state,
      current_period_start = excluded.current_period_start,
      current_period_end = excluded.current_period_end,
      grace_period_end = excluded.grace_period_end,
      cancel_at_period_end = excluded.cancel_at_period_end,
      cancelled_at = excluded.cancelled_at;

  update public.billing_events
  set processing_status = 'processed', processed_at = statement_timestamp()
  where provider_event_id = p_provider_event_id;

  if computed_access_state = 'active' then
    insert into public.analytics_events (
      organization_id, event_name, source_app, properties
    ) values (
      p_organization_id,
      'subscription_activated',
      'portal',
      jsonb_build_object('plan_id', p_plan_id, 'provider', 'stripe')
    );
  elsif computed_access_state = 'cancelled' then
    insert into public.analytics_events (
      organization_id, event_name, source_app, properties
    ) values (
      p_organization_id,
      'subscription_cancelled',
      'portal',
      jsonb_build_object('plan_id', p_plan_id, 'provider', 'stripe')
    );
  end if;

  return 'processed';
end;
$$;
revoke all on function public.record_stripe_billing_event(text, text, text, text, uuid, text) from public;
revoke all on function public.process_stripe_subscription_event(text, text, text, uuid, text, text, text, text, timestamptz, timestamptz, boolean) from public;
grant execute on function public.record_stripe_billing_event(text, text, text, text, uuid, text) to service_role;
grant execute on function public.process_stripe_subscription_event(text, text, text, uuid, text, text, text, text, timestamptz, timestamptz, boolean) to service_role;
comment on function public.process_stripe_subscription_event is
  'Idempotently records a signed Stripe event and updates customer, subscription and safe analytics in one transaction.';
