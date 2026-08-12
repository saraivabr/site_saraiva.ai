-- First-party product analytics for the seven Saraiva.AI applications.
-- Anonymous acquisition data is limited to opaque identifiers, coarse
-- attribution and paths. IP addresses, user-agent strings, query strings,
-- conversation content and CRM fields are deliberately not stored.

alter table public.analytics_events
  drop constraint analytics_events_name_check;
alter table public.analytics_events
  add constraint analytics_events_name_check check (event_name in (
    'session_started', 'page_viewed', 'cta_clicked', 'journey_selected',
    'sign_up_completed', 'onboarding_started', 'onboarding_completed',
    'first_chat_message_sent', 'first_value_reached', 'resource_viewed',
    'resource_favorited', 'lesson_started', 'lesson_completed',
    'experiment_viewed', 'deliverable_saved', 'contact_created',
    'opportunity_created', 'usage_limit_reached', 'upgrade_started',
    'checkout_started', 'subscription_activated', 'subscription_cancelled'
  ));
alter table public.analytics_events
  add column session_id uuid,
  add column idempotency_key uuid,
  add column path text,
  add constraint analytics_events_path_check check (
    path is null or (path ~ '^/[^?#]{0,255}$' and length(path) <= 256)
  ),
  add constraint analytics_events_source_app_check check (source_app in (
    'portal', 'academia', 'laboratorio', 'biblioteca', 'chat', 'comunidade', 'gestao'
  ));
create unique index analytics_events_idempotency_idx
  on public.analytics_events (idempotency_key)
  where idempotency_key is not null;
create unique index analytics_events_session_start_idx
  on public.analytics_events (session_id, event_name)
  where event_name = 'session_started' and session_id is not null;
create index analytics_events_session_occurred_idx
  on public.analytics_events (session_id, occurred_at desc)
  where session_id is not null;
create index analytics_events_app_occurred_idx
  on public.analytics_events (source_app, occurred_at desc);
create index analytics_events_user_occurred_idx
  on public.analytics_events (user_id, occurred_at desc)
  where user_id is not null;
create index analytics_events_organization_occurred_idx
  on public.analytics_events (organization_id, occurred_at desc)
  where organization_id is not null;
create table public.analytics_sessions (
  id uuid primary key,
  anonymous_id uuid not null,
  identified_user_id uuid references auth.users (id) on delete set null,
  organization_id uuid references public.organizations (id) on delete set null,
  first_source_app text not null,
  last_source_app text not null,
  landing_path text not null,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint analytics_sessions_source_check check (
    first_source_app in ('portal', 'academia', 'laboratorio', 'biblioteca', 'chat', 'comunidade', 'gestao')
    and last_source_app in ('portal', 'academia', 'laboratorio', 'biblioteca', 'chat', 'comunidade', 'gestao')
  ),
  constraint analytics_sessions_landing_path_check check (
    landing_path ~ '^/[^?#]{0,255}$' and length(landing_path) <= 256
  ),
  constraint analytics_sessions_device_check check (
    device_type is null or device_type in ('mobile', 'tablet', 'desktop')
  ),
  constraint analytics_sessions_time_check check (last_seen_at >= first_seen_at)
);
create index analytics_sessions_anonymous_seen_idx
  on public.analytics_sessions (anonymous_id, last_seen_at desc);
create index analytics_sessions_first_seen_idx
  on public.analytics_sessions (first_seen_at desc);
alter table public.analytics_events
  add constraint analytics_events_session_fkey
  foreign key (session_id) references public.analytics_sessions (id) on delete set null;
alter table public.analytics_sessions enable row level security;
create policy analytics_sessions_select_super_admin
on public.analytics_sessions for select to authenticated
using (public.is_super_admin());
revoke all on table public.analytics_sessions from anon, authenticated;
grant select on table public.analytics_sessions to authenticated;
grant all on table public.analytics_sessions to service_role;
create or replace function public.ingest_product_analytics_event(
  p_session_id uuid,
  p_anonymous_id uuid,
  p_idempotency_key uuid,
  p_event_name text,
  p_source_app text,
  p_path text,
  p_properties jsonb default '{}'::jsonb,
  p_user_id uuid default null,
  p_organization_id uuid default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  property_key text;
  inserted_id uuid;
begin
  if p_event_name not in ('session_started', 'page_viewed', 'cta_clicked', 'journey_selected') then
    raise exception 'public analytics event denied' using errcode = '22023';
  end if;
  if p_source_app not in ('portal', 'academia', 'laboratorio', 'biblioteca', 'chat', 'comunidade', 'gestao') then
    raise exception 'analytics source denied' using errcode = '22023';
  end if;
  if p_path is null or p_path !~ '^/[^?#]{0,255}$' or length(p_path) > 256 then
    raise exception 'analytics path denied' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_properties, '{}'::jsonb)) <> 'object'
     or pg_column_size(coalesce(p_properties, '{}'::jsonb)) > 2048 then
    raise exception 'analytics properties denied' using errcode = '22023';
  end if;
  for property_key in select jsonb_object_keys(coalesce(p_properties, '{}'::jsonb)) loop
    if property_key not in (
      'cta', 'placement', 'journey', 'plan', 'utm_source', 'utm_medium',
      'utm_campaign', 'referrer_host', 'device_type', 'entry_type'
    ) then
      raise exception 'analytics property denied' using errcode = '22023';
    end if;
  end loop;
  if p_user_id is null and p_organization_id is not null then
    raise exception 'analytics identity denied' using errcode = '22023';
  end if;
  if p_user_id is not null and p_organization_id is not null and not exists (
    select 1 from public.organization_members
    where user_id = p_user_id and organization_id = p_organization_id
  ) then
    raise exception 'analytics organization identity denied' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.analytics_sessions
    where id = p_session_id and anonymous_id <> p_anonymous_id
  ) then
    raise exception 'analytics session identity denied' using errcode = '42501';
  end if;
  if (
    select count(*) from public.analytics_events
    where session_id = p_session_id and occurred_at >= statement_timestamp() - interval '1 hour'
  ) >= 240 then
    return 'rate_limited';
  end if;

  insert into public.analytics_sessions (
    id, anonymous_id, identified_user_id, organization_id,
    first_source_app, last_source_app, landing_path,
    referrer_host, utm_source, utm_medium, utm_campaign, device_type
  ) values (
    p_session_id, p_anonymous_id, p_user_id, p_organization_id,
    p_source_app, p_source_app, p_path,
    nullif(left(p_properties ->> 'referrer_host', 160), ''),
    nullif(left(p_properties ->> 'utm_source', 100), ''),
    nullif(left(p_properties ->> 'utm_medium', 100), ''),
    nullif(left(p_properties ->> 'utm_campaign', 100), ''),
    case when p_properties ->> 'device_type' in ('mobile', 'tablet', 'desktop')
      then p_properties ->> 'device_type' else null end
  ) on conflict (id) do update
  set last_source_app = excluded.last_source_app,
      identified_user_id = coalesce(public.analytics_sessions.identified_user_id, excluded.identified_user_id),
      organization_id = coalesce(public.analytics_sessions.organization_id, excluded.organization_id),
      last_seen_at = statement_timestamp();

  if p_user_id is not null then
    update public.analytics_events
    set user_id = p_user_id,
        organization_id = coalesce(organization_id, p_organization_id)
    where session_id = p_session_id and user_id is null;
  end if;

  insert into public.analytics_events (
    organization_id, user_id, anonymous_id, session_id,
    idempotency_key, event_name, source_app,
    path, properties, occurred_at
  ) values (
    p_organization_id, p_user_id, p_anonymous_id, p_session_id,
    p_idempotency_key, p_event_name,
    p_source_app, p_path, coalesce(p_properties, '{}'::jsonb), statement_timestamp()
  ) on conflict do nothing
  returning id into inserted_id;

  return case when inserted_id is null then 'duplicate' else 'accepted' end;
end;
$$;
revoke all on function public.ingest_product_analytics_event(uuid, uuid, uuid, text, text, text, jsonb, uuid, uuid) from public;
grant execute on function public.ingest_product_analytics_event(uuid, uuid, uuid, text, text, text, jsonb, uuid, uuid) to service_role;
create or replace function public.record_profile_created_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.analytics_events (user_id, event_name, source_app, occurred_at)
  values (new.id, 'sign_up_completed', 'portal', new.created_at);
  return new;
end;
$$;
create trigger profiles_record_sign_up
after insert on public.profiles
for each row execute function public.record_profile_created_event();
create or replace function public.record_profile_onboarding_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_organization_id uuid;
begin
  if old.onboarding_completed_at is null and new.onboarding_completed_at is not null then
    select organization_id into target_organization_id
    from public.organization_members
    where user_id = new.id
    order by created_at
    limit 1;
    insert into public.analytics_events (
      organization_id, user_id, event_name, source_app, occurred_at
    ) values (
      target_organization_id, new.id, 'onboarding_completed', 'portal', new.onboarding_completed_at
    );
  end if;
  return new;
end;
$$;
create trigger profiles_record_onboarding
after update of onboarding_completed_at on public.profiles
for each row execute function public.record_profile_onboarding_event();
create or replace function public.record_editorial_product_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'library_history' then
    insert into public.analytics_events (
      organization_id, user_id, event_name, source_app, properties, occurred_at
    ) values (
      new.organization_id, new.user_id, 'resource_viewed', 'biblioteca',
      jsonb_build_object('resource_id', new.resource_id), new.viewed_at
    );
  elsif tg_table_name = 'library_favorites' then
    insert into public.analytics_events (
      organization_id, user_id, event_name, source_app, properties, occurred_at
    ) values (
      new.organization_id, new.user_id, 'resource_favorited', 'biblioteca',
      jsonb_build_object('resource_id', new.resource_id), new.created_at
    );
  elsif tg_table_name = 'chat_deliverables' then
    insert into public.analytics_events (
      organization_id, user_id, event_name, source_app, properties, occurred_at
    ) values (
      new.organization_id, new.created_by, 'deliverable_saved', 'chat',
      jsonb_build_object('record_id', new.id, 'deliverable_type', new.type), new.created_at
    );
  elsif tg_table_name = 'academy_lesson_progress' then
    if (tg_op = 'INSERT' and new.status in ('in_progress', 'completed'))
       or (tg_op = 'UPDATE' and old.status = 'not_started' and new.status in ('in_progress', 'completed')) then
      insert into public.analytics_events (
        organization_id, user_id, event_name, source_app, properties, occurred_at
      ) values (
        new.organization_id, new.user_id, 'lesson_started', 'academia',
        jsonb_build_object('lesson_id', new.lesson_id), coalesce(new.started_at, statement_timestamp())
      );
    end if;
    if new.status = 'completed' and (tg_op = 'INSERT' or old.status <> 'completed') then
      insert into public.analytics_events (
        organization_id, user_id, event_name, source_app, properties, occurred_at
      ) values (
        new.organization_id, new.user_id, 'lesson_completed', 'academia',
        jsonb_build_object('lesson_id', new.lesson_id), coalesce(new.completed_at, statement_timestamp())
      );
    end if;
  end if;
  return new;
end;
$$;
create trigger library_history_record_analytics
after insert on public.library_history
for each row execute function public.record_editorial_product_event();
create trigger library_favorites_record_analytics
after insert on public.library_favorites
for each row execute function public.record_editorial_product_event();
create trigger chat_deliverables_record_analytics
after insert on public.chat_deliverables
for each row execute function public.record_editorial_product_event();
create trigger academy_progress_record_analytics
after insert or update of status on public.academy_lesson_progress
for each row execute function public.record_editorial_product_event();
revoke all on function public.record_profile_created_event(), public.record_profile_onboarding_event(), public.record_editorial_product_event() from public;
insert into public.analytics_events (user_id, event_name, source_app, occurred_at)
select p.id, 'sign_up_completed', 'portal', p.created_at
from public.profiles p
where not exists (
  select 1 from public.analytics_events e
  where e.user_id = p.id and e.event_name = 'sign_up_completed'
);
insert into public.analytics_events (organization_id, user_id, event_name, source_app, occurred_at)
select m.organization_id, p.id, 'onboarding_completed', 'portal', p.onboarding_completed_at
from public.profiles p
left join lateral (
  select organization_id from public.organization_members
  where user_id = p.id order by created_at limit 1
) m on true
where p.onboarding_completed_at is not null
and not exists (
  select 1 from public.analytics_events e
  where e.user_id = p.id and e.event_name = 'onboarding_completed'
);
create or replace function public.admin_product_analytics(
  p_from date,
  p_to date
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  start_at timestamptz := p_from::timestamptz;
  end_at timestamptz := (p_to + 1)::timestamptz;
  result jsonb;
begin
  if not public.is_super_admin() then
    raise exception 'super admin required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_to < p_from or p_to - p_from > 366 then
    raise exception 'invalid analytics range' using errcode = '22023';
  end if;

  with scoped as materialized (
    select * from public.analytics_events
    where occurred_at >= start_at and occurred_at < end_at
  ),
  daily_aggregate as (
    select occurred_at::date as day,
      count(*) filter (where event_name = 'page_viewed')::bigint as page_views,
      count(distinct session_id) filter (where event_name = 'session_started')::bigint as sessions,
      count(*) filter (where event_name = 'sign_up_completed')::bigint as signups,
      count(*) filter (where event_name = 'first_value_reached')::bigint as first_values,
      count(*) filter (where event_name = 'subscription_activated')::bigint as subscriptions
    from scoped group by occurred_at::date
  ),
  days as (
    select generate_series(p_from, p_to, interval '1 day')::date as day
  ),
  funnel_definition(stage_order, event_name, label) as (
    values
      (1, 'page_viewed', 'Visitou'),
      (2, 'sign_up_completed', 'Criou conta'),
      (3, 'onboarding_completed', 'Concluiu onboarding'),
      (4, 'first_chat_message_sent', 'Conversou no Chat'),
      (5, 'first_value_reached', 'Chegou à primeira vitória'),
      (6, 'checkout_started', 'Iniciou checkout'),
      (7, 'subscription_activated', 'Assinou')
  ),
  funnel as (
    select f.stage_order, f.event_name, f.label,
      count(s.id)::bigint as events,
      count(distinct coalesce(s.user_id::text, s.anonymous_id::text, s.session_id::text, s.organization_id::text))::bigint as actors
    from funnel_definition f
    left join scoped s on s.event_name = f.event_name
    group by f.stage_order, f.event_name, f.label
    order by f.stage_order
  ),
  apps as (
    select source_app,
      count(*) filter (where event_name = 'page_viewed')::bigint as page_views,
      count(distinct session_id)::bigint as sessions,
      count(distinct user_id) filter (where user_id is not null)::bigint as users,
      count(*) filter (where event_name not in ('session_started', 'page_viewed', 'cta_clicked', 'journey_selected'))::bigint as product_events
    from scoped group by source_app order by page_views desc, product_events desc
  ),
  sources as (
    select coalesce(nullif(properties ->> 'utm_source', ''), 'direto') as source,
      count(distinct session_id)::bigint as sessions
    from scoped where event_name = 'session_started'
    group by coalesce(nullif(properties ->> 'utm_source', ''), 'direto')
    order by sessions desc
    limit 12
  ),
  revenue as (
    select
      count(*)::bigint as active_subscriptions,
      coalesce(sum(case when p.billing_interval = 'year'
        then coalesce(p.price_in_cents, 0) / 12
        else coalesce(p.price_in_cents, 0) end), 0)::bigint as mrr_cents
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.access_state in ('active', 'grace_period')
  )
  select jsonb_build_object(
    'range', jsonb_build_object('from', p_from, 'to', p_to),
    'summary', jsonb_build_object(
      'visitors', count(distinct anonymous_id) filter (where event_name = 'session_started'),
      'sessions', count(distinct session_id) filter (where event_name = 'session_started'),
      'page_views', count(*) filter (where event_name = 'page_viewed'),
      'signups', count(*) filter (where event_name = 'sign_up_completed'),
      'first_values', count(*) filter (where event_name = 'first_value_reached'),
      'upgrades_started', count(*) filter (where event_name in ('upgrade_started', 'checkout_started')),
      'subscriptions_activated', count(*) filter (where event_name = 'subscription_activated'),
      'active_subscriptions', (select active_subscriptions from revenue),
      'mrr_cents', (select mrr_cents from revenue),
      'estimated_ai_cost_micros', (
        select coalesce(sum(estimated_cost_micros), 0)::bigint
        from public.usage_records
        where created_at >= start_at and created_at < end_at
      )
    ),
    'funnel', (select coalesce(jsonb_agg(to_jsonb(funnel) order by stage_order), '[]'::jsonb) from funnel),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'page_views', coalesce(a.page_views, 0),
        'sessions', coalesce(a.sessions, 0),
        'signups', coalesce(a.signups, 0),
        'first_values', coalesce(a.first_values, 0),
        'subscriptions', coalesce(a.subscriptions, 0)
      ) order by d.day), '[]'::jsonb)
      from days d left join daily_aggregate a using (day)
    ),
    'apps', (select coalesce(jsonb_agg(to_jsonb(apps)), '[]'::jsonb) from apps),
    'sources', (select coalesce(jsonb_agg(to_jsonb(sources)), '[]'::jsonb) from sources)
  ) into result
  from scoped;

  return result;
end;
$$;
revoke all on function public.admin_product_analytics(date, date) from public;
grant execute on function public.admin_product_analytics(date, date) to authenticated;
grant execute on function public.admin_product_analytics(date, date) to service_role;
comment on table public.analytics_sessions is
  'First-party anonymous sessions without IP, raw user agent, fingerprint, query string or user content.';
comment on function public.ingest_product_analytics_event is
  'Service-only allowlisted collector with bounded properties, idempotency and per-session rate limiting.';
comment on function public.admin_product_analytics is
  'Super-admin-only aggregate funnel, product usage, attribution, MRR and AI cost metrics.';
