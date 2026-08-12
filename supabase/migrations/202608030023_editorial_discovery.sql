-- Editorial discovery remains intentionally separate from CRM and conversations.
-- The search function exposes only published metadata, while related-resource
-- writes are restricted to explicit super-admin curation.

create extension if not exists unaccent with schema extensions;
create table public.library_resource_relations (
  source_resource_id uuid not null references public.library_resources (id) on delete cascade,
  target_resource_id uuid not null references public.library_resources (id) on delete cascade,
  position integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (source_resource_id, target_resource_id),
  constraint library_resource_relations_no_self_check check (source_resource_id <> target_resource_id),
  constraint library_resource_relations_position_check check (position >= 0)
);
create index library_resource_relations_target_idx
  on public.library_resource_relations (target_resource_id);
alter table public.library_resource_relations enable row level security;
create policy library_resource_relations_read_published
on public.library_resource_relations for select to anon, authenticated
using (
  (
    exists (
      select 1 from public.library_resources as source
      where source.id = source_resource_id
        and source.editorial_status = 'published'
    )
    and exists (
      select 1 from public.library_resources as target
      where target.id = target_resource_id
        and target.editorial_status = 'published'
    )
  )
  or public.is_super_admin()
);
revoke all on table public.library_resource_relations from anon, authenticated;
grant select on table public.library_resource_relations to anon, authenticated;
grant all on table public.library_resource_relations to service_role;
create or replace function public.set_library_related_resources(
  p_resource_id uuid,
  p_related_resource_ids uuid[]
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_ids uuid[];
  requested_count integer;
  valid_count integer;
  previous_ids uuid[];
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  select coalesce(array_agg(candidate.id order by candidate.ordinality), '{}'::uuid[])
  into normalized_ids
  from (
    select distinct on (value) value as id, ordinality
    from unnest(coalesce(p_related_resource_ids, '{}'::uuid[])) with ordinality as requested(value, ordinality)
    order by value, ordinality
  ) as candidate;

  requested_count := cardinality(normalized_ids);
  if requested_count > 6 or p_resource_id = any(normalized_ids) then
    raise exception 'invalid related resource selection' using errcode = '22023';
  end if;

  perform 1
  from public.library_resources
  where id = p_resource_id
    and editorial_status <> 'archived'
  for update;
  if not found then
    raise exception 'library resource not found' using errcode = 'P0002';
  end if;

  select count(*)::integer into valid_count
  from public.library_resources
  where id = any(normalized_ids)
    and editorial_status = 'published';
  if valid_count <> requested_count then
    raise exception 'published related resource not found' using errcode = '22023';
  end if;

  select coalesce(array_agg(target_resource_id order by position), '{}'::uuid[])
  into previous_ids
  from public.library_resource_relations
  where source_resource_id = p_resource_id;

  delete from public.library_resource_relations
  where source_resource_id = p_resource_id;

  insert into public.library_resource_relations (
    source_resource_id, target_resource_id, position, created_by
  )
  select p_resource_id, related.id, related.ordinality - 1, current_user_id
  from unnest(normalized_ids) with ordinality as related(id, ordinality);

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    current_user_id,
    'library_resource.related_resources_updated',
    'library_resource',
    p_resource_id::text,
    jsonb_build_object('resource_ids', previous_ids),
    jsonb_build_object('resource_ids', normalized_ids)
  );

  return requested_count;
end;
$$;
revoke all on function public.set_library_related_resources(uuid, uuid[]) from public;
grant execute on function public.set_library_related_resources(uuid, uuid[]) to authenticated;
create or replace function public.search_editorial_catalog(
  p_query text,
  p_app text default null,
  p_plan text default null,
  p_format text default null,
  p_category text default null,
  p_tag text default null,
  p_intent text default null,
  p_limit integer default 40
)
returns table (
  app text,
  item_type text,
  slug text,
  title text,
  description text,
  required_plan text,
  category_slug text,
  tags text[],
  intent text,
  relevance real
)
language sql
stable
security definer
set search_path = ''
as $$
  with normalized as (
    select
      nullif(btrim(p_query), '') as query_text,
      nullif(btrim(p_app), '') as app_filter,
      nullif(btrim(p_plan), '') as plan_filter,
      nullif(btrim(p_format), '') as format_filter,
      nullif(btrim(p_category), '') as category_filter,
      nullif(btrim(p_tag), '') as tag_filter,
      nullif(btrim(p_intent), '') as intent_filter,
      greatest(1, least(coalesce(p_limit, 40), 80)) as result_limit
  ), search_term as (
    select
      *,
      websearch_to_tsquery('portuguese', query_text) as query,
      websearch_to_tsquery('portuguese', extensions.unaccent(query_text)) as normalized_query
    from normalized
    where query_text is not null
      and char_length(query_text) <= 120
  ), catalog as (
    select
      'biblioteca'::text as app,
      resource.type as item_type,
      resource.slug,
      resource.title,
      resource.description,
      resource.required_plan,
      category.slug as category_slug,
      coalesce((
        select array_agg(tag.slug order by tag.slug)
        from public.library_resource_tags as link
        join public.content_tags as tag on tag.id = link.tag_id
        where link.resource_id = resource.id
      ), '{}'::text[]) as tags,
      null::text as intent,
      greatest(
        ts_rank_cd(resource.search_document, term.query),
        ts_rank_cd(extensions.unaccent(resource.search_document::text)::tsvector, term.normalized_query)
      )::real as relevance
    from public.library_resources as resource
    left join public.content_categories as category on category.id = resource.category_id
    cross join search_term as term
    where resource.editorial_status = 'published'
      and (
        resource.search_document @@ term.query
        or extensions.unaccent(resource.search_document::text)::tsvector @@ term.normalized_query
      )
      and (term.app_filter is null or term.app_filter = 'biblioteca')
      and (term.plan_filter is null or resource.required_plan = term.plan_filter)
      and (term.format_filter is null or resource.type = term.format_filter)
      and (term.category_filter is null or category.slug = term.category_filter)
      and (
        term.tag_filter is null
        or exists (
          select 1
          from public.library_resource_tags as filter_link
          join public.content_tags as filter_tag on filter_tag.id = filter_link.tag_id
          where filter_link.resource_id = resource.id
            and filter_tag.slug = term.tag_filter
        )
      )
      and term.intent_filter is null

    union all

    select
      'academia', 'course', course.slug, course.title, course.description,
      course.required_plan, null, '{}'::text[], track.intent,
      greatest(
        ts_rank_cd(course.search_document, term.query),
        ts_rank_cd(extensions.unaccent(course.search_document::text)::tsvector, term.normalized_query)
      )::real
    from public.academy_courses as course
    join public.academy_tracks as track on track.id = course.track_id
    cross join search_term as term
    where course.editorial_status = 'published'
      and track.editorial_status = 'published'
      and (
        course.search_document @@ term.query
        or extensions.unaccent(course.search_document::text)::tsvector @@ term.normalized_query
      )
      and (term.app_filter is null or term.app_filter = 'academia')
      and (term.plan_filter is null or course.required_plan = term.plan_filter)
      and (term.format_filter is null or term.format_filter = 'course')
      and term.category_filter is null
      and term.tag_filter is null
      and (term.intent_filter is null or track.intent = term.intent_filter)

    union all

    select
      'academia', 'lesson', lesson.slug, lesson.title, lesson.summary,
      lesson.required_plan, null, '{}'::text[], track.intent,
      greatest(
        ts_rank_cd(lesson.search_document, term.query),
        ts_rank_cd(extensions.unaccent(lesson.search_document::text)::tsvector, term.normalized_query)
      )::real
    from public.academy_lessons as lesson
    join public.academy_modules as module on module.id = lesson.module_id
    join public.academy_courses as course on course.id = module.course_id
    join public.academy_tracks as track on track.id = course.track_id
    cross join search_term as term
    where lesson.editorial_status = 'published'
      and course.editorial_status = 'published'
      and track.editorial_status = 'published'
      and (
        lesson.search_document @@ term.query
        or extensions.unaccent(lesson.search_document::text)::tsvector @@ term.normalized_query
      )
      and (term.app_filter is null or term.app_filter = 'academia')
      and (term.plan_filter is null or lesson.required_plan = term.plan_filter)
      and (term.format_filter is null or term.format_filter = 'lesson')
      and term.category_filter is null
      and term.tag_filter is null
      and (term.intent_filter is null or track.intent = term.intent_filter)

    union all

    select
      'laboratorio', 'experiment', experiment.slug, experiment.title,
      experiment.summary, experiment.required_plan, null, '{}'::text[], null,
      greatest(
        ts_rank_cd(experiment.search_document, term.query),
        ts_rank_cd(extensions.unaccent(experiment.search_document::text)::tsvector, term.normalized_query)
      )::real
    from public.laboratory_experiments as experiment
    cross join search_term as term
    where experiment.editorial_status = 'published'
      and (
        experiment.search_document @@ term.query
        or extensions.unaccent(experiment.search_document::text)::tsvector @@ term.normalized_query
      )
      and (term.app_filter is null or term.app_filter = 'laboratorio')
      and (term.plan_filter is null or experiment.required_plan = term.plan_filter)
      and (term.format_filter is null or term.format_filter = 'experiment')
      and term.category_filter is null
      and term.tag_filter is null
      and term.intent_filter is null
  )
  select
    catalog.app,
    catalog.item_type,
    catalog.slug,
    catalog.title,
    catalog.description,
    catalog.required_plan,
    catalog.category_slug,
    catalog.tags,
    catalog.intent,
    catalog.relevance
  from catalog
  order by catalog.relevance desc, catalog.title
  limit (select result_limit from normalized);
$$;
revoke all on function public.search_editorial_catalog(text,text,text,text,text,text,text,integer) from public;
grant execute on function public.search_editorial_catalog(text,text,text,text,text,text,text,integer) to anon, authenticated;
comment on table public.library_resource_relations is
  'Curated links between Library resources. Public reads require both sides to be published.';
comment on function public.search_editorial_catalog(text,text,text,text,text,text,text,integer) is
  'Published editorial metadata search. It never indexes CRM, conversations, progress or other private tenant data.';
