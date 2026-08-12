-- A single explicit moderation boundary lets the content team publish imported
-- Academy, Laboratory and consented Community records without SQL access.

create or replace function public.moderate_editorial_entity(
  p_entity_type text, p_entity_id uuid, p_action text
)
returns text language plpgsql security definer set search_path = ''
as $$
declare current_user_id uuid := auth.uid(); next_status text; previous_value jsonb;
begin
  if current_user_id is null or not public.is_super_admin() then
    raise exception 'global administration denied' using errcode = '42501';
  end if;
  if p_action not in ('review', 'publish', 'archive') then raise exception 'invalid editorial action' using errcode = '22023'; end if;
  next_status := case p_action when 'publish' then 'published' when 'archive' then 'archived' else 'review' end;

  if p_entity_type = 'academy_track' then
    select jsonb_build_object('title', title, 'status', editorial_status, 'ownership_status', ownership_status) into previous_value from public.academy_tracks where id = p_entity_id for update;
    if p_action = 'publish' and (previous_value ->> 'ownership_status') = 'unconfirmed' then raise exception 'unconfirmed ownership cannot be published' using errcode = '22023'; end if;
    update public.academy_tracks set editorial_status = next_status, reviewed_at = case when p_action='publish' then statement_timestamp() else reviewed_at end, reviewed_by = case when p_action='publish' then current_user_id else reviewed_by end, published_at = case when p_action='publish' then coalesce(published_at,statement_timestamp()) else published_at end where id=p_entity_id;
  elsif p_entity_type = 'academy_course' then
    select jsonb_build_object('title', title, 'status', editorial_status, 'ownership_status', ownership_status) into previous_value from public.academy_courses where id = p_entity_id for update;
    if p_action = 'publish' and (previous_value ->> 'ownership_status') = 'unconfirmed' then raise exception 'unconfirmed ownership cannot be published' using errcode = '22023'; end if;
    if p_action = 'publish' and not exists (select 1 from public.academy_courses c join public.academy_tracks t on t.id=c.track_id where c.id=p_entity_id and t.editorial_status='published') then raise exception 'published track is required' using errcode = '22023'; end if;
    update public.academy_courses set editorial_status=next_status, reviewed_at=case when p_action='publish' then statement_timestamp() else reviewed_at end, reviewed_by=case when p_action='publish' then current_user_id else reviewed_by end, published_at=case when p_action='publish' then coalesce(published_at,statement_timestamp()) else published_at end where id=p_entity_id;
  elsif p_entity_type = 'academy_lesson' then
    select jsonb_build_object('title', title, 'status', editorial_status, 'ownership_status', ownership_status) into previous_value from public.academy_lessons where id = p_entity_id for update;
    if p_action = 'publish' and (previous_value ->> 'ownership_status') = 'unconfirmed' then raise exception 'unconfirmed ownership cannot be published' using errcode = '22023'; end if;
    if p_action = 'publish' and not exists (select 1 from public.academy_lessons l join public.academy_modules m on m.id=l.module_id join public.academy_courses c on c.id=m.course_id where l.id=p_entity_id and c.editorial_status='published') then raise exception 'published course is required' using errcode = '22023'; end if;
    update public.academy_lessons set editorial_status=next_status, reviewed_at=case when p_action='publish' then statement_timestamp() else reviewed_at end, reviewed_by=case when p_action='publish' then current_user_id else reviewed_by end, published_at=case when p_action='publish' then coalesce(published_at,statement_timestamp()) else published_at end where id=p_entity_id;
  elsif p_entity_type = 'laboratory_experiment' then
    select jsonb_build_object('title', title, 'status', editorial_status, 'ownership_status', ownership_status) into previous_value from public.laboratory_experiments where id = p_entity_id for update;
    if p_action = 'publish' and (previous_value ->> 'ownership_status') = 'unconfirmed' then raise exception 'unconfirmed ownership cannot be published' using errcode = '22023'; end if;
    update public.laboratory_experiments set editorial_status=next_status, reviewed_at=case when p_action='publish' then statement_timestamp() else reviewed_at end, reviewed_by=case when p_action='publish' then current_user_id else reviewed_by end, published_at=case when p_action='publish' then coalesce(published_at,statement_timestamp()) else published_at end where id=p_entity_id;
  elsif p_entity_type = 'community_profile' then
    select jsonb_build_object('display_name', display_name, 'status', publication_status, 'consented', consented_at is not null) into previous_value from public.community_profiles where user_id = p_entity_id for update;
    if p_action = 'publish' and not coalesce((previous_value ->> 'consented')::boolean, false) then raise exception 'profile consent is required' using errcode = '22023'; end if;
    update public.community_profiles set publication_status=case p_action when 'publish' then 'published' when 'archive' then 'hidden' else 'review' end, reviewed_at=case when p_action='publish' then statement_timestamp() else reviewed_at end, reviewed_by=case when p_action='publish' then current_user_id else reviewed_by end where user_id=p_entity_id;
    next_status := case p_action when 'publish' then 'published' when 'archive' then 'hidden' else 'review' end;
  else raise exception 'invalid editorial entity' using errcode = '22023';
  end if;
  if previous_value is null then raise exception 'editorial entity not found' using errcode = 'P0002'; end if;
  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, previous_value, new_value)
  values (current_user_id, p_entity_type || '.' || p_action, p_entity_type, p_entity_id::text, previous_value, jsonb_build_object('status',next_status));
  return next_status;
end;
$$;
revoke all on function public.moderate_editorial_entity(text,uuid,text) from public;
grant execute on function public.moderate_editorial_entity(text,uuid,text) to authenticated;
