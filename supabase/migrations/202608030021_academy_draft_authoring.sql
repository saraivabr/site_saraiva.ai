-- The Academy can be filled from the Portal without direct database access.
-- Tracks, courses and lessons always start as drafts; modules are structural
-- and remain invisible until their course and lessons are explicitly published.

create or replace function public.validate_academy_authoring_metadata(
  p_author text,
  p_ownership_status text,
  p_required_plan text
)
returns void
language plpgsql
immutable
security definer
set search_path = ''
as $$
begin
  if char_length(btrim(coalesce(p_author, ''))) not between 2 and 200 then
    raise exception 'invalid academy author' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;
end;
$$;
create or replace function public.create_academy_track_draft(
  p_slug text,
  p_title text,
  p_description text,
  p_intent text,
  p_author text,
  p_ownership_status text,
  p_required_plan text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  track_id uuid := gen_random_uuid();
  normalized_slug text := lower(btrim(coalesce(p_slug, '')));
  normalized_title text := btrim(coalesce(p_title, ''));
  normalized_description text := btrim(coalesce(p_description, ''));
  normalized_author text := btrim(coalesce(p_author, ''));
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if char_length(normalized_slug) not between 3 and 120
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     or char_length(normalized_title) not between 2 and 200
     or char_length(normalized_description) not between 10 and 4000
     or p_intent not in ('apply_to_company', 'sell_solutions') then
    raise exception 'invalid academy track draft' using errcode = '22023';
  end if;
  perform public.validate_academy_authoring_metadata(normalized_author, p_ownership_status, p_required_plan);

  insert into public.academy_tracks (
    id, slug, title, description, intent, editorial_status, required_plan,
    source_system, source_id, author, ownership_status
  ) values (
    track_id, normalized_slug, normalized_title, normalized_description,
    p_intent, 'draft', p_required_plan, 'portal_admin',
    'manual:' || track_id::text, normalized_author, p_ownership_status
  );

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, new_value)
  values (
    current_user_id, 'academy_track.draft_created', 'academy_track', track_id::text,
    jsonb_build_object(
      'slug', normalized_slug, 'title', normalized_title, 'intent', p_intent,
      'author', normalized_author, 'ownership_status', p_ownership_status,
      'required_plan', p_required_plan, 'source_system', 'portal_admin'
    )
  );
  return track_id;
end;
$$;
create or replace function public.create_academy_course_draft(
  p_track_id uuid,
  p_slug text,
  p_title text,
  p_description text,
  p_position integer,
  p_author text,
  p_ownership_status text,
  p_required_plan text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  course_id uuid := gen_random_uuid();
  normalized_slug text := lower(btrim(coalesce(p_slug, '')));
  normalized_title text := btrim(coalesce(p_title, ''));
  normalized_description text := btrim(coalesce(p_description, ''));
  normalized_author text := btrim(coalesce(p_author, ''));
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.academy_tracks as track
    where track.id = p_track_id and track.editorial_status <> 'archived'
  ) then
    raise exception 'academy track not found' using errcode = '22023';
  end if;
  if char_length(normalized_slug) not between 3 and 120
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     or char_length(normalized_title) not between 2 and 200
     or char_length(normalized_description) not between 10 and 4000
     or coalesce(p_position, -1) not between 0 and 10000 then
    raise exception 'invalid academy course draft' using errcode = '22023';
  end if;
  perform public.validate_academy_authoring_metadata(normalized_author, p_ownership_status, p_required_plan);

  insert into public.academy_courses (
    id, track_id, slug, title, description, position, editorial_status,
    required_plan, source_system, source_id, author, ownership_status
  ) values (
    course_id, p_track_id, normalized_slug, normalized_title,
    normalized_description, p_position, 'draft', p_required_plan,
    'portal_admin', 'manual:' || course_id::text, normalized_author,
    p_ownership_status
  );

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, new_value)
  values (
    current_user_id, 'academy_course.draft_created', 'academy_course', course_id::text,
    jsonb_build_object(
      'track_id', p_track_id, 'slug', normalized_slug, 'title', normalized_title,
      'position', p_position, 'author', normalized_author,
      'ownership_status', p_ownership_status, 'required_plan', p_required_plan,
      'source_system', 'portal_admin'
    )
  );
  return course_id;
end;
$$;
create or replace function public.create_academy_module(
  p_course_id uuid,
  p_title text,
  p_position integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  module_id uuid := gen_random_uuid();
  normalized_title text := btrim(coalesce(p_title, ''));
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.academy_courses as course
    where course.id = p_course_id and course.editorial_status <> 'archived'
  ) then
    raise exception 'academy course not found' using errcode = '22023';
  end if;
  if char_length(normalized_title) not between 2 and 200
     or coalesce(p_position, -1) not between 0 and 10000 then
    raise exception 'invalid academy module' using errcode = '22023';
  end if;

  insert into public.academy_modules (id, course_id, title, position)
  values (module_id, p_course_id, normalized_title, p_position);

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, new_value)
  values (
    current_user_id, 'academy_module.created', 'academy_module', module_id::text,
    jsonb_build_object('course_id', p_course_id, 'title', normalized_title, 'position', p_position)
  );
  return module_id;
end;
$$;
create or replace function public.update_academy_module(
  p_module_id uuid,
  p_title text,
  p_position integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_title text := btrim(coalesce(p_title, ''));
  previous_value jsonb;
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if char_length(normalized_title) not between 2 and 200
     or coalesce(p_position, -1) not between 0 and 10000 then
    raise exception 'invalid academy module' using errcode = '22023';
  end if;

  select jsonb_build_object('title', module.title, 'position', module.position)
  into previous_value
  from public.academy_modules as module
  where module.id = p_module_id
  for update;
  if previous_value is null then
    raise exception 'academy module not found' using errcode = 'P0002';
  end if;

  update public.academy_modules
  set title = normalized_title, position = p_position
  where id = p_module_id;

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    current_user_id, 'academy_module.updated', 'academy_module', p_module_id::text,
    previous_value, jsonb_build_object('title', normalized_title, 'position', p_position)
  );
end;
$$;
create or replace function public.create_academy_lesson_draft(
  p_module_id uuid,
  p_slug text,
  p_title text,
  p_summary text,
  p_body text,
  p_video_url text,
  p_position integer,
  p_duration_minutes integer,
  p_author text,
  p_ownership_status text,
  p_required_plan text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  lesson_id uuid := gen_random_uuid();
  normalized_slug text := lower(btrim(coalesce(p_slug, '')));
  normalized_title text := btrim(coalesce(p_title, ''));
  normalized_summary text := btrim(coalesce(p_summary, ''));
  normalized_body text := btrim(coalesce(p_body, ''));
  normalized_video_url text := nullif(btrim(coalesce(p_video_url, '')), '');
  normalized_author text := btrim(coalesce(p_author, ''));
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if not exists (
    select 1
    from public.academy_modules as module
    join public.academy_courses as course on course.id = module.course_id
    where module.id = p_module_id and course.editorial_status <> 'archived'
  ) then
    raise exception 'academy module not found' using errcode = '22023';
  end if;
  if char_length(normalized_slug) not between 3 and 120
     or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     or char_length(normalized_title) not between 2 and 200
     or char_length(normalized_summary) not between 10 and 4000
     or char_length(normalized_body) not between 20 and 50000
     or coalesce(p_position, -1) not between 0 and 10000
     or coalesce(p_duration_minutes, 0) not between 1 and 1440 then
    raise exception 'invalid academy lesson draft' using errcode = '22023';
  end if;
  if normalized_video_url is not null and (
    char_length(normalized_video_url) > 2048
    or normalized_video_url !~ '^https?://[^[:space:]]+$'
  ) then
    raise exception 'invalid academy lesson video url' using errcode = '22023';
  end if;
  perform public.validate_academy_authoring_metadata(normalized_author, p_ownership_status, p_required_plan);

  insert into public.academy_lessons (
    id, module_id, slug, title, summary, body, video_url, position,
    duration_minutes, editorial_status, required_plan, source_system,
    source_id, author, ownership_status
  ) values (
    lesson_id, p_module_id, normalized_slug, normalized_title,
    normalized_summary, normalized_body, normalized_video_url, p_position,
    p_duration_minutes, 'draft', p_required_plan, 'portal_admin',
    'manual:' || lesson_id::text, normalized_author, p_ownership_status
  );

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, new_value)
  values (
    current_user_id, 'academy_lesson.draft_created', 'academy_lesson', lesson_id::text,
    jsonb_build_object(
      'module_id', p_module_id, 'slug', normalized_slug, 'title', normalized_title,
      'position', p_position, 'duration_minutes', p_duration_minutes,
      'video_attached', normalized_video_url is not null, 'author', normalized_author,
      'ownership_status', p_ownership_status, 'required_plan', p_required_plan,
      'source_system', 'portal_admin'
    )
  );
  return lesson_id;
end;
$$;
revoke all on function public.validate_academy_authoring_metadata(text,text,text) from public;
revoke all on function public.create_academy_track_draft(text,text,text,text,text,text,text) from public;
revoke all on function public.create_academy_course_draft(uuid,text,text,text,integer,text,text,text) from public;
revoke all on function public.create_academy_module(uuid,text,integer) from public;
revoke all on function public.update_academy_module(uuid,text,integer) from public;
revoke all on function public.create_academy_lesson_draft(uuid,text,text,text,text,text,integer,integer,text,text,text) from public;
grant execute on function public.create_academy_track_draft(text,text,text,text,text,text,text) to authenticated;
grant execute on function public.create_academy_course_draft(uuid,text,text,text,integer,text,text,text) to authenticated;
grant execute on function public.create_academy_module(uuid,text,integer) to authenticated;
grant execute on function public.update_academy_module(uuid,text,integer) to authenticated;
grant execute on function public.create_academy_lesson_draft(uuid,text,text,text,text,text,integer,integer,text,text,text) to authenticated;
comment on function public.create_academy_track_draft(text,text,text,text,text,text,text) is
  'Creates an audited Academy track draft without publishing it.';
comment on function public.create_academy_course_draft(uuid,text,text,text,integer,text,text,text) is
  'Creates an audited Academy course draft under a non-archived track.';
comment on function public.create_academy_module(uuid,text,integer) is
  'Creates an audited structural Academy module under a non-archived course.';
comment on function public.create_academy_lesson_draft(uuid,text,text,text,text,text,integer,integer,text,text,text) is
  'Creates an audited Academy lesson draft; the lesson body is excluded from audit logs.';
