create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'site',
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_normalized check (email = lower(btrim(email))),
  constraint newsletter_subscribers_email_unique unique (email)
);

alter table public.newsletter_subscribers enable row level security;
revoke all on table public.newsletter_subscribers from anon, authenticated;
grant all on table public.newsletter_subscribers to service_role;

comment on table public.newsletter_subscribers is 'Assinantes da newsletter publica Saraiva.AI; escrita somente pelo servidor.';
