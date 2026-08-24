create table if not exists public.editorial_offers (
  source_record_id text primary key check (source_record_id ~ '^rec[[:alnum:]]{14}$'),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  offer_type text not null default '',
  buyer text not null default '',
  problem text not null default '',
  delivery text not null default '',
  source_status text not null default '',
  public_status text not null default 'Em validação',
  potential smallint not null default 0 check (potential between 0 and 5),
  display_order integer not null default 0,
  is_published boolean not null default false,
  source_system text not null default 'airtable-products-offers' check (source_system = 'airtable-products-offers'),
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists editorial_offers_public_idx
  on public.editorial_offers (is_published, display_order, potential desc, updated_at desc);

alter table public.editorial_offers enable row level security;

revoke all on table public.editorial_offers from anon, authenticated;
grant select on table public.editorial_offers to anon, authenticated;
grant all on table public.editorial_offers to service_role;

drop policy if exists "published airtable offers are public" on public.editorial_offers;
create policy "published airtable offers are public"
  on public.editorial_offers
  for select
  using (is_published and source_system = 'airtable-products-offers');

comment on table public.editorial_offers is
  'Projeção pública sanitizada da tabela Airtable Produtos e Ofertas. A origem interna permanece no Airtable; preço, observações, repositórios e próximos passos não são copiados.';

comment on column public.editorial_offers.is_published is
  'Reflete exclusivamente o gate Publicar no site do Airtable.';
