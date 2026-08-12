-- Explicit edit/create RPCs complete the management launch flows while keeping
-- every mutation tenant-checked and plan-limited in PostgreSQL.

create or replace function public.update_crm_contact(
  p_organization_id uuid, p_contact_id uuid, p_name text, p_company_id uuid default null,
  p_email text default null, p_phone text default null, p_notes text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); company_name text; updated_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if p_company_id is not null then
    select name into company_name from public.crm_companies where organization_id = p_organization_id and id = p_company_id;
    if company_name is null then raise exception 'company not found in organization' using errcode = '42501'; end if;
  end if;
  update public.crm_contacts set name = nullif(btrim(p_name), ''), company_id = p_company_id, company = company_name,
    email = nullif(lower(btrim(p_email)), ''), phone = nullif(btrim(p_phone), ''), notes = nullif(btrim(p_notes), '')
  where organization_id = p_organization_id and id = p_contact_id returning id into updated_id;
  if updated_id is null then raise exception 'contact not found in organization' using errcode = 'P0002'; end if;
  return updated_id;
end;
$$;
create or replace function public.update_crm_company(
  p_organization_id uuid, p_company_id uuid, p_name text, p_website text default null, p_notes text default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); updated_id uuid; normalized_name text := nullif(btrim(p_name), '');
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  update public.crm_companies set name = normalized_name, website = nullif(btrim(p_website), ''), notes = nullif(btrim(p_notes), '')
  where organization_id = p_organization_id and id = p_company_id returning id into updated_id;
  if updated_id is null then raise exception 'company not found in organization' using errcode = 'P0002'; end if;
  update public.crm_contacts set company = normalized_name
  where organization_id = p_organization_id and company_id = p_company_id;
  return updated_id;
end;
$$;
create or replace function public.create_crm_opportunity(
  p_organization_id uuid, p_contact_id uuid, p_title text,
  p_stage text default 'novo', p_value numeric default 0, p_currency text default 'BRL',
  p_probability smallint default 0, p_expected_close_date date default null
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); new_id uuid;
begin
  if current_user_id is null or not public.can_write_organization(p_organization_id) then
    raise exception 'write access to organization denied' using errcode = '42501';
  end if;
  if not exists (select 1 from public.crm_contacts where organization_id = p_organization_id and id = p_contact_id) then
    raise exception 'contact not found in organization' using errcode = '42501';
  end if;
  insert into public.crm_opportunities (organization_id, contact_id, title, stage, value, currency, probability, expected_close_date, created_by)
  values (p_organization_id, p_contact_id, nullif(btrim(p_title), ''), lower(btrim(p_stage)), p_value, upper(btrim(p_currency)), p_probability, p_expected_close_date, current_user_id)
  returning id into new_id;
  insert into public.crm_activities (organization_id, opportunity_id, user_id, type, description, metadata)
  values (p_organization_id, new_id, current_user_id, 'created', 'Oportunidade criada', jsonb_build_object('stage', lower(btrim(p_stage)), 'value', p_value));
  return new_id;
end;
$$;
revoke all on function public.update_crm_contact(uuid,uuid,text,uuid,text,text,text) from public;
revoke all on function public.update_crm_company(uuid,uuid,text,text,text) from public;
revoke all on function public.create_crm_opportunity(uuid,uuid,text,text,numeric,text,smallint,date) from public;
grant execute on function public.update_crm_contact(uuid,uuid,text,uuid,text,text,text) to authenticated;
grant execute on function public.update_crm_company(uuid,uuid,text,text,text) to authenticated;
grant execute on function public.create_crm_opportunity(uuid,uuid,text,text,numeric,text,smallint,date) to authenticated;
