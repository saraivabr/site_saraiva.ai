do $$
begin
  if not exists (
    select 1
    from public.editorial_articles
    where source_id = '7e165d83-3c64-4e6f-9b89-c01182fb7491'
      and slug = 'o-gargalo-saiu-da-lista'
      and source_system = 'saraiva-owned'
      and author = 'Fellipe Saraiva'
  ) then
    raise exception 'Piloto autoral nao encontrado ou identidade divergente';
  end if;
end $$;

update public.editorial_articles
set
  is_published = true,
  published_at = '2026-08-12T23:50:00Z',
  updated_at = now()
where source_id = '7e165d83-3c64-4e6f-9b89-c01182fb7491'
  and slug = 'o-gargalo-saiu-da-lista'
  and source_system = 'saraiva-owned';
