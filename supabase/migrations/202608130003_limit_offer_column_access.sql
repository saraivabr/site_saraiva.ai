revoke select on table public.editorial_offers from anon, authenticated;

grant select (
  slug,
  name,
  offer_type,
  buyer,
  problem,
  delivery,
  public_status,
  is_published,
  updated_at
) on table public.editorial_offers to anon, authenticated;

comment on table public.editorial_offers is
  'Projeção pública mínima da tabela Airtable Produtos e Ofertas. A API pública recebe somente os campos editoriais explicitamente concedidos; identificadores e metadados de sincronização permanecem server-only.';
