-- Super administrators can create complete Laboratory experiments from the
-- Portal. New experiments are always drafts and related resources must already
-- be published, preventing a draft from exposing unreleased Library metadata.

create or replace function public.validate_laboratory_related_resources(
  p_resource_ids uuid[]
)
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  normalized_resource_ids uuid[] := coalesce(p_resource_ids, '{}'::uuid[]);
  requested_count integer;
  published_count integer;
begin
  select count(distinct resource_id)::integer
  into requested_count
  from unnest(normalized_resource_ids) as resource_id;

  if requested_count > 20 then
    raise exception 'too many related resources' using errcode = '22023';
  end if;

  select count(*)::integer
  into published_count
  from public.library_resources as resource
  where resource.id = any(normalized_resource_ids)
    and resource.editorial_status = 'published';

  if published_count <> requested_count then
    raise exception 'published related resource not found' using errcode = '22023';
  end if;
end;
$$;
create or replace function public.create_laboratory_experiment_draft(
  p_slug text,
  p_title text,
  p_summary text,
  p_problem text,
  p_hypothesis text,
  p_tools text[],
  p_execution text,
  p_result text,
  p_limitations text,
  p_reproduction text,
  p_author text,
  p_ownership_status text,
  p_required_plan text,
  p_related_resource_ids uuid[]
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
  normalized_summary text := btrim(coalesce(p_summary, ''));
  normalized_problem text := btrim(coalesce(p_problem, ''));
  normalized_hypothesis text := btrim(coalesce(p_hypothesis, ''));
  normalized_execution text := btrim(coalesce(p_execution, ''));
  normalized_result text := btrim(coalesce(p_result, ''));
  normalized_limitations text := btrim(coalesce(p_limitations, ''));
  normalized_reproduction text := btrim(coalesce(p_reproduction, ''));
  normalized_author text := btrim(coalesce(p_author, ''));
  normalized_tools text[];
  normalized_resource_ids uuid[] := coalesce(p_related_resource_ids, '{}'::uuid[]);
  experiment_id uuid := gen_random_uuid();
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  if char_length(normalized_slug) not between 3 and 120
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'invalid laboratory experiment slug' using errcode = '22023';
  end if;

  select coalesce(array_agg(tool order by first_position), '{}'::text[])
  into normalized_tools
  from (
    select btrim(tool) as tool, min(position) as first_position
    from unnest(coalesce(p_tools, '{}'::text[])) with ordinality as input(tool, position)
    where nullif(btrim(tool), '') is not null
    group by btrim(tool)
  ) as unique_tools;

  if char_length(normalized_title) not between 2 and 200
     or char_length(normalized_summary) not between 10 and 4000
     or char_length(normalized_problem) not between 10 and 10000
     or char_length(normalized_hypothesis) not between 10 and 10000
     or char_length(normalized_execution) not between 20 and 20000
     or char_length(normalized_result) not between 10 and 20000
     or char_length(normalized_limitations) not between 10 and 20000
     or char_length(normalized_reproduction) not between 20 and 20000
     or char_length(normalized_author) not between 2 and 200
     or coalesce(array_length(normalized_tools, 1), 0) not between 1 and 20
     or exists (select 1 from unnest(normalized_tools) as tool where char_length(tool) > 200) then
    raise exception 'incomplete laboratory experiment' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;

  perform public.validate_laboratory_related_resources(normalized_resource_ids);

  insert into public.laboratory_experiments (
    id,
    slug,
    title,
    summary,
    problem,
    hypothesis,
    tools,
    execution,
    result,
    limitations,
    reproduction,
    related_resource_ids,
    editorial_status,
    required_plan,
    source_system,
    source_id,
    author,
    ownership_status
  ) values (
    experiment_id,
    normalized_slug,
    normalized_title,
    normalized_summary,
    normalized_problem,
    normalized_hypothesis,
    normalized_tools,
    normalized_execution,
    normalized_result,
    normalized_limitations,
    normalized_reproduction,
    (select coalesce(array_agg(resource_id order by resource_id), '{}'::uuid[]) from (select distinct resource_id from unnest(normalized_resource_ids) as resource_id) as selected_resource),
    'draft',
    p_required_plan,
    'portal_admin',
    'manual:' || experiment_id::text,
    normalized_author,
    p_ownership_status
  );

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    new_value
  ) values (
    current_user_id,
    'laboratory_experiment.draft_created',
    'laboratory_experiment',
    experiment_id::text,
    jsonb_build_object(
      'slug', normalized_slug,
      'title', normalized_title,
      'author', normalized_author,
      'ownership_status', p_ownership_status,
      'required_plan', p_required_plan,
      'tool_count', coalesce(array_length(normalized_tools, 1), 0),
      'related_resource_count', (select count(distinct resource_id) from unnest(normalized_resource_ids) as resource_id),
      'source_system', 'portal_admin'
    )
  );

  return experiment_id;
end;
$$;
create or replace function public.set_laboratory_related_resources(
  p_experiment_id uuid,
  p_resource_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_resource_ids uuid[] := coalesce(p_resource_ids, '{}'::uuid[]);
  previous_resource_ids uuid[];
  next_resource_ids uuid[];
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;

  perform public.validate_laboratory_related_resources(normalized_resource_ids);

  select experiment.related_resource_ids
  into previous_resource_ids
  from public.laboratory_experiments as experiment
  where experiment.id = p_experiment_id
  for update;
  if not found then
    raise exception 'laboratory experiment not found' using errcode = 'P0002';
  end if;

  select coalesce(array_agg(resource_id order by resource_id), '{}'::uuid[])
  into next_resource_ids
  from (select distinct resource_id from unnest(normalized_resource_ids) as resource_id) as selected_resource;

  update public.laboratory_experiments
  set related_resource_ids = next_resource_ids
  where id = p_experiment_id;

  insert into public.audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    previous_value,
    new_value
  ) values (
    current_user_id,
    'laboratory_experiment.related_resources_updated',
    'laboratory_experiment',
    p_experiment_id::text,
    jsonb_build_object('resource_ids', previous_resource_ids),
    jsonb_build_object('resource_ids', next_resource_ids)
  );
end;
$$;
revoke all on function public.validate_laboratory_related_resources(uuid[]) from public;
revoke all on function public.create_laboratory_experiment_draft(text,text,text,text,text,text[],text,text,text,text,text,text,text,uuid[]) from public;
revoke all on function public.set_laboratory_related_resources(uuid,uuid[]) from public;
grant execute on function public.create_laboratory_experiment_draft(text,text,text,text,text,text[],text,text,text,text,text,text,text,uuid[]) to authenticated;
grant execute on function public.set_laboratory_related_resources(uuid,uuid[]) to authenticated;
comment on function public.create_laboratory_experiment_draft(text,text,text,text,text,text[],text,text,text,text,text,text,text,uuid[]) is
  'Creates a complete, audited Laboratory draft; publication remains a separate human decision.';
comment on function public.set_laboratory_related_resources(uuid,uuid[]) is
  'Atomically links only published Library resources to a Laboratory experiment.';
