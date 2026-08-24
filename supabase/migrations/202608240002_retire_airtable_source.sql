-- O Airtable deixa de ser fonte das ofertas: curadoria passa a ser
-- direta no Supabase. Mantém o valor antigo permitido no check (histórico
-- de dados/migrations), mas o default e as linhas existentes migram para
-- 'saraiva-editorial'.

alter table public.editorial_offers
  drop constraint editorial_offers_source_system_check;

alter table public.editorial_offers
  add constraint editorial_offers_source_system_check
  check (source_system in ('airtable-products-offers', 'saraiva-editorial'));

alter table public.editorial_offers
  alter column source_system set default 'saraiva-editorial';

update public.editorial_offers
  set source_system = 'saraiva-editorial'
  where source_system = 'airtable-products-offers';
