-- Super administrators can author traceable Library drafts without direct
-- database access. Creation and taxonomy updates remain transactional and
-- never publish content implicitly.

create or replace function public.validate_library_taxonomy(
  p_category_id uuid,
  p_tag_ids uuid[]
)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  normalized_tag_ids uuid[] := coalesce(p_tag_ids, '{}'::uuid[]);
  requested_tag_count integer;
  existing_tag_count integer;
begin
  if p_category_id is not null and not exists (
    select 1 from public.content_categories as category where category.id = p_category_id
  ) then
    raise exception 'content category not found' using errcode = '22023';
  end if;

  select count(distinct tag_id)::integer
  into requested_tag_count
  from unnest(normalized_tag_ids) as tag_id;

  if requested_tag_count > 20 then
    raise exception 'too many content tags' using errcode = '22023';
  end if;

  select count(*)::integer
  into existing_tag_count
  from public.content_tags as tag
  where tag.id = any(normalized_tag_ids);

  if existing_tag_count <> requested_tag_count then
    raise exception 'content tag not found' using errcode = '22023';
  end if;
end;
$$;
create or replace function public.create_library_resource_draft(
  p_slug text,
  p_type text,
  p_title text,
  p_description text,
  p_author text,
  p_ownership_status text,
  p_required_plan text,
  p_content text,
  p_instructions text,
  p_external_url text,
  p_category_id uuid,
  p_tag_ids uuid[],
  p_source_fingerprint text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_slug text := lower(btrim(coalesce(p_slug, '')));
  normalized_title text := btrim(coalesce(p_title, ''));
  normalized_description text := btrim(coalesce(p_description, ''));
  normalized_author text := btrim(coalesce(p_author, ''));
  normalized_content text := btrim(coalesce(p_content, ''));
  normalized_instructions text := nullif(btrim(coalesce(p_instructions, '')), '');
  normalized_external_url text := nullif(btrim(coalesce(p_external_url, '')), '');
  normalized_fingerprint text := lower(btrim(coalesce(p_source_fingerprint, '')));
  normalized_tag_ids uuid[] := coalesce(p_tag_ids, '{}'::uuid[]);
  resource_id uuid := gen_random_uuid();
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  if char_length(normalized_slug) not between 3 and 120
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'invalid library resource slug' using errcode = '22023';
  end if;
  if p_type not in ('prompt', 'template', 'checklist', 'tool', 'guide', 'automation', 'process', 'file', 'method') then
    raise exception 'invalid library resource type' using errcode = '22023';
  end if;
  if char_length(normalized_title) not between 2 and 200
     or char_length(normalized_description) not between 10 and 2000
     or char_length(normalized_author) not between 2 and 200
     or char_length(normalized_content) not between 20 and 200000
     or char_length(coalesce(normalized_instructions, '')) > 20000 then
    raise exception 'incomplete library resource draft' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;
  if normalized_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid source fingerprint' using errcode = '22023';
  end if;
  if normalized_external_url is not null and (
    char_length(normalized_external_url) > 2048
    or normalized_external_url !~ '^https?://[^[:space:]]+$'
  ) then
    raise exception 'invalid external source url' using errcode = '22023';
  end if;

  perform public.validate_library_taxonomy(p_category_id, normalized_tag_ids);

  insert into public.library_resources (
    id,
    slug,
    type,
    title,
    description,
    category_id,
    external_url,
    source_system,
    source_id,
    source_fingerprint,
    original_title,
    author,
    ownership_status,
    editorial_status,
    required_plan
  ) values (
    resource_id,
    normalized_slug,
    p_type,
    normalized_title,
    normalized_description,
    p_category_id,
    normalized_external_url,
    'portal_admin',
    'manual:' || resource_id::text,
    normalized_fingerprint,
    normalized_title,
    normalized_author,
    p_ownership_status,
    'draft',
    p_required_plan
  );

  insert into public.library_resource_contents (resource_id, content, instructions)
  values (resource_id, normalized_content, normalized_instructions);

  insert into public.library_resource_tags (resource_id, tag_id)
  select resource_id, selected_tag.tag_id
  from (
    select distinct tag_id from unnest(normalized_tag_ids) as tag_id
  ) as selected_tag;

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    new_value
  ) values (
    current_user_id,
    'library_resource.draft_created',
    'library_resource',
    resource_id::text,
    jsonb_build_object(
      'slug', normalized_slug,
      'type', p_type,
      'title', normalized_title,
      'author', normalized_author,
      'ownership_status', p_ownership_status,
      'required_plan', p_required_plan,
      'category_id', p_category_id,
      'tag_count', (select count(distinct tag_id) from unnest(normalized_tag_ids) as tag_id),
      'source_system', 'portal_admin'
    )
  );

  return resource_id;
end;
$$;
create or replace function public.set_library_resource_taxonomy(
  p_resource_id uuid,
  p_category_id uuid,
  p_tag_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_tag_ids uuid[] := coalesce(p_tag_ids, '{}'::uuid[]);
  previous_category_id uuid;
  previous_tag_ids uuid[];
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  perform public.validate_library_taxonomy(p_category_id, normalized_tag_ids);

  select resource.category_id
  into previous_category_id
  from public.library_resources as resource
  where resource.id = p_resource_id
  for update;

  if not found then
    raise exception 'library resource not found' using errcode = 'P0002';
  end if;

  select coalesce(array_agg(link.tag_id order by link.tag_id), '{}'::uuid[])
  into previous_tag_ids
  from public.library_resource_tags as link
  where link.resource_id = p_resource_id;

  update public.library_resources
  set category_id = p_category_id
  where id = p_resource_id;

  delete from public.library_resource_tags
  where resource_id = p_resource_id;

  insert into public.library_resource_tags (resource_id, tag_id)
  select p_resource_id, selected_tag.tag_id
  from (
    select distinct tag_id from unnest(normalized_tag_ids) as tag_id
  ) as selected_tag;

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value
  ) values (
    current_user_id,
    'library_resource.taxonomy_updated',
    'library_resource',
    p_resource_id::text,
    jsonb_build_object('category_id', previous_category_id, 'tag_ids', previous_tag_ids),
    jsonb_build_object(
      'category_id', p_category_id,
      'tag_ids', (select coalesce(jsonb_agg(tag_id order by tag_id), '[]'::jsonb) from (select distinct tag_id from unnest(normalized_tag_ids) as tag_id) as selected_tag)
    )
  );
end;
$$;
revoke all on function public.validate_library_taxonomy(uuid, uuid[]) from public;
revoke all on function public.create_library_resource_draft(text,text,text,text,text,text,text,text,text,text,uuid,uuid[],text) from public;
revoke all on function public.set_library_resource_taxonomy(uuid,uuid,uuid[]) from public;
grant execute on function public.create_library_resource_draft(text,text,text,text,text,text,text,text,text,text,uuid,uuid[],text) to authenticated;
grant execute on function public.set_library_resource_taxonomy(uuid,uuid,uuid[]) to authenticated;
comment on function public.create_library_resource_draft(text,text,text,text,text,text,text,text,text,text,uuid,uuid[],text) is
  'Creates an audited, traceable Library draft for later human review; never publishes implicitly.';
comment on function public.set_library_resource_taxonomy(uuid,uuid,uuid[]) is
  'Atomically replaces a Library resource category and tags after global-admin validation.';
