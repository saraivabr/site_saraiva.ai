create or replace function public.sync_editorial_offers(p_rows jsonb)
returns table (published_count integer, unpublished_count integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_published integer := 0;
  v_unpublished integer := 0;
begin
  if jsonb_typeof(p_rows) is distinct from 'array' then
    raise exception 'p_rows must be a JSON array';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_rows) as row_data(
      source_record_id text,
      slug text,
      name text,
      offer_type text,
      buyer text,
      problem text,
      delivery text,
      public_status text
    )
    where row_data.source_record_id !~ '^rec[[:alnum:]]{14}$'
      or row_data.slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      or nullif(btrim(row_data.name), '') is null
      or nullif(btrim(row_data.offer_type), '') is null
      or nullif(btrim(row_data.buyer), '') is null
      or nullif(btrim(row_data.problem), '') is null
      or nullif(btrim(row_data.delivery), '') is null
      or row_data.public_status not in ('Em validação', 'Em construção', 'Disponível')
  ) then
    raise exception 'invalid public offer payload';
  end if;

  insert into public.editorial_offers (
    source_record_id,
    slug,
    name,
    offer_type,
    buyer,
    problem,
    delivery,
    public_status,
    is_published,
    source_system,
    updated_at
  )
  select
    row_data.source_record_id,
    row_data.slug,
    row_data.name,
    row_data.offer_type,
    row_data.buyer,
    row_data.problem,
    row_data.delivery,
    row_data.public_status,
    true,
    'airtable-products-offers',
    now()
  from jsonb_to_recordset(p_rows) as row_data(
    source_record_id text,
    slug text,
    name text,
    offer_type text,
    buyer text,
    problem text,
    delivery text,
    public_status text
  )
  on conflict (source_record_id) do update
  set
    slug = excluded.slug,
    name = excluded.name,
    offer_type = excluded.offer_type,
    buyer = excluded.buyer,
    problem = excluded.problem,
    delivery = excluded.delivery,
    public_status = excluded.public_status,
    is_published = true,
    source_system = 'airtable-products-offers',
    updated_at = now();

  get diagnostics v_published = row_count;

  update public.editorial_offers as offer
  set is_published = false, updated_at = now()
  where offer.source_system = 'airtable-products-offers'
    and offer.is_published
    and not exists (
      select 1
      from jsonb_array_elements(p_rows) as incoming(value)
      where incoming.value ->> 'source_record_id' = offer.source_record_id
    );

  get diagnostics v_unpublished = row_count;
  return query select v_published, v_unpublished;
end;
$$;

revoke all on function public.sync_editorial_offers(jsonb) from public, anon, authenticated;
grant execute on function public.sync_editorial_offers(jsonb) to service_role;

comment on function public.sync_editorial_offers(jsonb) is
  'Reconcilia atomicamente a projeção pública do Airtable: o upsert e a despublicação acontecem na mesma transação.';
