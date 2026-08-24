alter table public.editorial_offers
  drop column if exists source_status,
  drop column if exists potential,
  drop column if exists display_order,
  drop column if exists source_updated_at,
  drop column if exists imported_at;

drop index if exists public.editorial_offers_public_idx;
create index editorial_offers_public_idx
  on public.editorial_offers (is_published, updated_at desc);

comment on table public.editorial_offers is
  'Projeção pública mínima da tabela Airtable Produtos e Ofertas. A origem interna permanece no Airtable; status interno, potencial, preço, observações, repositórios e próximos passos não são copiados.';
