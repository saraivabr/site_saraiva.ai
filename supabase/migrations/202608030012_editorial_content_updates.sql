-- Content review must include the content itself, not only a status button.
-- These RPCs keep Academy and Laboratory edits server-authorized and audited.

create or replace function public.review_academy_entity(
  p_entity_type text,
  p_entity_id uuid,
  p_title text,
  p_description text,
  p_summary text,
  p_body text,
  p_author text,
  p_ownership_status text,
  p_required_plan text,
  p_intent text,
  p_position integer,
  p_duration_minutes integer,
  p_action text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  next_status text;
  previous_value jsonb;
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_entity_type not in ('academy_track', 'academy_course', 'academy_lesson') then
    raise exception 'invalid academy entity' using errcode = '22023';
  end if;
  if p_action not in ('review', 'publish', 'archive') then
    raise exception 'invalid editorial action' using errcode = '22023';
  end if;
  if nullif(btrim(p_title), '') is null or nullif(btrim(p_author), '') is null then
    raise exception 'incomplete academy content' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;
  if p_action = 'publish' and p_ownership_status = 'unconfirmed' then
    raise exception 'unconfirmed ownership cannot be published' using errcode = '22023';
  end if;
  if coalesce(p_position, 0) < 0 or coalesce(p_duration_minutes, 1) <= 0 then
    raise exception 'invalid academy ordering or duration' using errcode = '22023';
  end if;

  next_status := case p_action
    when 'publish' then 'published'
    when 'archive' then 'archived'
    else 'review'
  end;

  if p_entity_type = 'academy_track' then
    if nullif(btrim(p_description), '') is null
       or (p_intent is not null and p_intent not in ('apply_to_company', 'sell_solutions')) then
      raise exception 'invalid academy track' using errcode = '22023';
    end if;
    select jsonb_build_object(
      'title', title, 'intent', intent, 'status', editorial_status,
      'author', author, 'ownership_status', ownership_status,
      'required_plan', required_plan
    ) into previous_value
    from public.academy_tracks where id = p_entity_id for update;
    update public.academy_tracks
    set title = left(btrim(p_title), 200),
        description = left(btrim(p_description), 4000),
        intent = p_intent,
        author = left(btrim(p_author), 200),
        ownership_status = p_ownership_status,
        required_plan = p_required_plan,
        editorial_status = next_status,
        reviewed_at = case when p_action = 'publish' then statement_timestamp() else reviewed_at end,
        reviewed_by = case when p_action = 'publish' then current_user_id else reviewed_by end,
        published_at = case when p_action = 'publish' then coalesce(published_at, statement_timestamp()) else published_at end
    where id = p_entity_id;
  elsif p_entity_type = 'academy_course' then
    if nullif(btrim(p_description), '') is null then
      raise exception 'invalid academy course' using errcode = '22023';
    end if;
    select jsonb_build_object(
      'title', title, 'position', position, 'status', editorial_status,
      'author', author, 'ownership_status', ownership_status,
      'required_plan', required_plan
    ) into previous_value
    from public.academy_courses where id = p_entity_id for update;
    if p_action = 'publish' and not exists (
      select 1 from public.academy_courses c
      join public.academy_tracks t on t.id = c.track_id
      where c.id = p_entity_id and t.editorial_status = 'published'
    ) then
      raise exception 'published track is required' using errcode = '22023';
    end if;
    update public.academy_courses
    set title = left(btrim(p_title), 200),
        description = left(btrim(p_description), 4000),
        position = coalesce(p_position, 0),
        author = left(btrim(p_author), 200),
        ownership_status = p_ownership_status,
        required_plan = p_required_plan,
        editorial_status = next_status,
        reviewed_at = case when p_action = 'publish' then statement_timestamp() else reviewed_at end,
        reviewed_by = case when p_action = 'publish' then current_user_id else reviewed_by end,
        published_at = case when p_action = 'publish' then coalesce(published_at, statement_timestamp()) else published_at end
    where id = p_entity_id;
  else
    if nullif(btrim(p_summary), '') is null or nullif(btrim(p_body), '') is null then
      raise exception 'invalid academy lesson' using errcode = '22023';
    end if;
    select jsonb_build_object(
      'title', title, 'position', position, 'duration_minutes', duration_minutes,
      'status', editorial_status, 'author', author,
      'ownership_status', ownership_status, 'required_plan', required_plan
    ) into previous_value
    from public.academy_lessons where id = p_entity_id for update;
    if p_action = 'publish' and not exists (
      select 1 from public.academy_lessons l
      join public.academy_modules m on m.id = l.module_id
      join public.academy_courses c on c.id = m.course_id
      where l.id = p_entity_id and c.editorial_status = 'published'
    ) then
      raise exception 'published course is required' using errcode = '22023';
    end if;
    update public.academy_lessons
    set title = left(btrim(p_title), 200),
        summary = left(btrim(p_summary), 4000),
        body = left(btrim(p_body), 50000),
        position = coalesce(p_position, 0),
        duration_minutes = p_duration_minutes,
        author = left(btrim(p_author), 200),
        ownership_status = p_ownership_status,
        required_plan = p_required_plan,
        editorial_status = next_status,
        reviewed_at = case when p_action = 'publish' then statement_timestamp() else reviewed_at end,
        reviewed_by = case when p_action = 'publish' then current_user_id else reviewed_by end,
        published_at = case when p_action = 'publish' then coalesce(published_at, statement_timestamp()) else published_at end
    where id = p_entity_id;
  end if;

  if previous_value is null then
    raise exception 'academy entity not found' using errcode = 'P0002';
  end if;

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    current_user_id,
    p_entity_type || '.' || p_action,
    p_entity_type,
    p_entity_id::text,
    previous_value,
    jsonb_build_object(
      'title', left(btrim(p_title), 200),
      'author', left(btrim(p_author), 200),
      'ownership_status', p_ownership_status,
      'required_plan', p_required_plan,
      'status', next_status,
      'content_updated', true
    )
  );
  return next_status;
end;
$$;
create or replace function public.review_laboratory_experiment(
  p_experiment_id uuid,
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
  p_action text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  next_status text;
  previous_value jsonb;
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_action not in ('review', 'publish', 'archive') then
    raise exception 'invalid editorial action' using errcode = '22023';
  end if;
  if nullif(btrim(p_title), '') is null
     or nullif(btrim(p_summary), '') is null
     or nullif(btrim(p_problem), '') is null
     or nullif(btrim(p_hypothesis), '') is null
     or nullif(btrim(p_execution), '') is null
     or nullif(btrim(p_result), '') is null
     or nullif(btrim(p_limitations), '') is null
     or nullif(btrim(p_reproduction), '') is null
     or nullif(btrim(p_author), '') is null
     or coalesce(array_length(p_tools, 1), 0) = 0
     or exists (select 1 from unnest(p_tools) as tool where nullif(btrim(tool), '') is null) then
    raise exception 'incomplete laboratory experiment' using errcode = '22023';
  end if;
  if p_ownership_status not in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed') then
    raise exception 'invalid ownership status' using errcode = '22023';
  end if;
  if p_required_plan not in ('free', 'pro_founder') then
    raise exception 'invalid required plan' using errcode = '22023';
  end if;
  if p_action = 'publish' and p_ownership_status = 'unconfirmed' then
    raise exception 'unconfirmed ownership cannot be published' using errcode = '22023';
  end if;

  select jsonb_build_object(
    'title', title, 'status', editorial_status, 'author', author,
    'ownership_status', ownership_status, 'required_plan', required_plan
  ) into previous_value
  from public.laboratory_experiments
  where id = p_experiment_id
  for update;
  if previous_value is null then
    raise exception 'laboratory experiment not found' using errcode = 'P0002';
  end if;

  next_status := case p_action
    when 'publish' then 'published'
    when 'archive' then 'archived'
    else 'review'
  end;
  update public.laboratory_experiments
  set title = left(btrim(p_title), 200),
      summary = left(btrim(p_summary), 4000),
      problem = left(btrim(p_problem), 10000),
      hypothesis = left(btrim(p_hypothesis), 10000),
      tools = p_tools,
      execution = left(btrim(p_execution), 20000),
      result = left(btrim(p_result), 20000),
      limitations = left(btrim(p_limitations), 20000),
      reproduction = left(btrim(p_reproduction), 20000),
      author = left(btrim(p_author), 200),
      ownership_status = p_ownership_status,
      required_plan = p_required_plan,
      editorial_status = next_status,
      reviewed_at = case when p_action = 'publish' then statement_timestamp() else reviewed_at end,
      reviewed_by = case when p_action = 'publish' then current_user_id else reviewed_by end,
      published_at = case when p_action = 'publish' then coalesce(published_at, statement_timestamp()) else published_at end
  where id = p_experiment_id;

  insert into public.audit_logs (
    actor_user_id, action, entity_type, entity_id, previous_value, new_value
  ) values (
    current_user_id,
    'laboratory_experiment.' || p_action,
    'laboratory_experiment',
    p_experiment_id::text,
    previous_value,
    jsonb_build_object(
      'title', left(btrim(p_title), 200),
      'author', left(btrim(p_author), 200),
      'ownership_status', p_ownership_status,
      'required_plan', p_required_plan,
      'status', next_status,
      'content_updated', true
    )
  );
  return next_status;
end;
$$;
revoke all on function public.review_academy_entity(text,uuid,text,text,text,text,text,text,text,text,integer,integer,text) from public;
grant execute on function public.review_academy_entity(text,uuid,text,text,text,text,text,text,text,text,integer,integer,text) to authenticated;
revoke all on function public.review_laboratory_experiment(uuid,text,text,text,text,text[],text,text,text,text,text,text,text,text) from public;
grant execute on function public.review_laboratory_experiment(uuid,text,text,text,text,text[],text,text,text,text,text,text,text,text) to authenticated;
comment on function public.review_academy_entity is
  'Audited Academy content review; full lesson bodies are never copied into audit logs.';
comment on function public.review_laboratory_experiment is
  'Audited Laboratory review with explicit result and limitations.';
