-- Database-owned business events prevent the UI from claiming milestones that
-- were not persisted. Payloads contain identifiers and counts, never message or
-- CRM field content.

create or replace function public.record_first_value_event()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare target_organization_id uuid;
begin
  if old.first_value_reached_at is null and new.first_value_reached_at is not null then
    select organization_id into target_organization_id from public.organization_members
    where user_id = new.id order by created_at limit 1;
    insert into public.analytics_events (organization_id, user_id, event_name, source_app, properties)
    values (target_organization_id, new.id, 'first_value_reached', 'chat', '{}'::jsonb);
  end if;
  return new;
end;
$$;
create trigger profiles_record_first_value after update of first_value_reached_at on public.profiles
for each row execute function public.record_first_value_event();
create or replace function public.record_mvp_insert_event()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare event_name_value text; event_user_id uuid; source_app_value text;
begin
  if tg_table_name = 'chat_generation_runs' then
    event_name_value := 'first_chat_message_sent'; event_user_id := new.user_id; source_app_value := 'chat';
  elsif tg_table_name = 'crm_contacts' then
    event_name_value := 'contact_created'; event_user_id := new.created_by; source_app_value := 'gestao';
  elsif tg_table_name = 'crm_opportunities' then
    event_name_value := 'opportunity_created'; event_user_id := new.created_by; source_app_value := 'gestao';
  else return new;
  end if;
  insert into public.analytics_events (organization_id, user_id, event_name, source_app, properties)
  values (new.organization_id, event_user_id, event_name_value, source_app_value, jsonb_build_object('record_id', new.id));
  return new;
end;
$$;
create trigger chat_generation_record_event after insert on public.chat_generation_runs
for each row execute function public.record_mvp_insert_event();
create trigger crm_contact_record_event after insert on public.crm_contacts
for each row execute function public.record_mvp_insert_event();
create trigger crm_opportunity_record_event after insert on public.crm_opportunities
for each row execute function public.record_mvp_insert_event();
revoke all on function public.record_first_value_event(), public.record_mvp_insert_event() from public;
