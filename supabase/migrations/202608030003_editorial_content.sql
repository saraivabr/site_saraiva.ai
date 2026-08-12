-- Shared editorial model for Biblioteca, Academia, Laboratório and Comunidade.
-- Metadata remains discoverable; paid bodies are stored separately and guarded
-- by entitlement-aware RLS so a locked card never leaks its content.

create or replace function public.has_complete_content_access(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions as subscription
    join public.plans as plan on plan.id = subscription.plan_id
    where subscription.organization_id = target_organization_id
      and subscription.access_state in ('active', 'grace_period')
      and plan.content_access = 'complete'
  );
$$;
create or replace function public.can_access_content(
  required_plan text,
  target_organization_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select required_plan = 'free'
    or (
      auth.uid() is not null
      and target_organization_id is not null
      and public.is_organization_member(target_organization_id)
      and public.has_complete_content_access(target_organization_id)
    )
    or public.is_super_admin();
$$;
revoke all on function public.has_complete_content_access(uuid) from public;
revoke all on function public.can_access_content(text, uuid) from public;
grant execute on function public.can_access_content(text, uuid) to anon, authenticated;
create table public.content_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  constraint content_categories_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint content_categories_name_check check (btrim(name) <> '')
);
create table public.content_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  constraint content_tags_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint content_tags_name_check check (btrim(name) <> '')
);
create table public.library_resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null,
  title text not null,
  description text not null,
  category_id uuid references public.content_categories (id) on delete set null,
  external_url text,
  file_path text,
  source_system text not null,
  source_id text not null,
  source_fingerprint text not null,
  original_title text not null,
  author text not null,
  ownership_status text not null,
  editorial_status text not null default 'review',
  required_plan text not null default 'pro_founder',
  imported_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(author, ''))
  ) stored,
  constraint library_resources_type_check check (type in ('prompt', 'template', 'checklist', 'tool', 'guide', 'automation', 'process', 'file', 'method')),
  constraint library_resources_status_check check (editorial_status in ('draft', 'review', 'published', 'archived')),
  constraint library_resources_plan_check check (required_plan in ('free', 'pro_founder')),
  constraint library_resources_ownership_check check (ownership_status in ('confirmed', 'unconfirmed', 'licensed', 'third_party_attributed')),
  constraint library_resources_source_key unique (source_system, source_id),
  constraint library_resources_fingerprint_check check (btrim(source_fingerprint) <> ''),
  constraint library_resources_publish_check check (
    editorial_status <> 'published'
    or (
      ownership_status <> 'unconfirmed'
      and reviewed_at is not null
      and reviewed_by is not null
      and published_at is not null
    )
  )
);
create trigger library_resources_set_updated_at
before update on public.library_resources
for each row execute function public.set_updated_at();
create index library_resources_search_idx on public.library_resources using gin (search_document);
create index library_resources_catalog_idx on public.library_resources (editorial_status, required_plan, type);
create table public.library_resource_contents (
  resource_id uuid primary key references public.library_resources (id) on delete cascade,
  content text not null,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint library_resource_contents_content_check check (btrim(content) <> '')
);
create trigger library_resource_contents_set_updated_at
before update on public.library_resource_contents
for each row execute function public.set_updated_at();
create table public.library_resource_tags (
  resource_id uuid not null references public.library_resources (id) on delete cascade,
  tag_id uuid not null references public.content_tags (id) on delete cascade,
  primary key (resource_id, tag_id)
);
create table public.library_favorites (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  resource_id uuid not null references public.library_resources (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);
create table public.library_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  resource_id uuid not null references public.library_resources (id) on delete cascade,
  viewed_at timestamptz not null default now()
);
create index library_history_user_viewed_idx on public.library_history (user_id, viewed_at desc);
create table public.academy_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  intent text,
  editorial_status text not null default 'review',
  required_plan text not null default 'pro_founder',
  source_system text not null,
  source_id text not null,
  author text not null,
  ownership_status text not null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academy_tracks_intent_check check (intent is null or intent in ('apply_to_company', 'sell_solutions')),
  constraint academy_tracks_status_check check (editorial_status in ('draft', 'review', 'published', 'archived')),
  constraint academy_tracks_plan_check check (required_plan in ('free', 'pro_founder')),
  constraint academy_tracks_source_key unique (source_system, source_id)
);
create trigger academy_tracks_set_updated_at
before update on public.academy_tracks
for each row execute function public.set_updated_at();
create table public.academy_courses (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.academy_tracks (id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null,
  position integer not null default 0,
  editorial_status text not null default 'review',
  required_plan text not null default 'pro_founder',
  source_system text not null,
  source_id text not null,
  author text not null,
  ownership_status text not null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academy_courses_position_check check (position >= 0),
  constraint academy_courses_status_check check (editorial_status in ('draft', 'review', 'published', 'archived')),
  constraint academy_courses_plan_check check (required_plan in ('free', 'pro_founder')),
  constraint academy_courses_source_key unique (source_system, source_id)
);
create trigger academy_courses_set_updated_at
before update on public.academy_courses
for each row execute function public.set_updated_at();
create table public.academy_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.academy_courses (id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint academy_modules_position_check check (position >= 0),
  constraint academy_modules_course_title_key unique (course_id, title)
);
create table public.academy_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.academy_modules (id) on delete cascade,
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  video_url text,
  position integer not null default 0,
  duration_minutes integer,
  editorial_status text not null default 'review',
  required_plan text not null default 'pro_founder',
  source_system text not null,
  source_id text not null,
  author text not null,
  ownership_status text not null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academy_lessons_position_check check (position >= 0),
  constraint academy_lessons_duration_check check (duration_minutes is null or duration_minutes > 0),
  constraint academy_lessons_status_check check (editorial_status in ('draft', 'review', 'published', 'archived')),
  constraint academy_lessons_plan_check check (required_plan in ('free', 'pro_founder')),
  constraint academy_lessons_source_key unique (source_system, source_id)
);
create trigger academy_lessons_set_updated_at
before update on public.academy_lessons
for each row execute function public.set_updated_at();
create table public.academy_lesson_progress (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.academy_lessons (id) on delete cascade,
  status text not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint academy_lesson_progress_status_check check (status in ('not_started', 'in_progress', 'completed')),
  constraint academy_lesson_progress_dates_check check (status <> 'completed' or completed_at is not null)
);
create trigger academy_lesson_progress_set_updated_at
before update on public.academy_lesson_progress
for each row execute function public.set_updated_at();
create table public.laboratory_experiments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  problem text not null,
  hypothesis text not null,
  tools text[] not null default '{}',
  execution text not null,
  result text not null,
  limitations text not null,
  reproduction text not null,
  related_resource_ids uuid[] not null default '{}',
  editorial_status text not null default 'review',
  required_plan text not null default 'pro_founder',
  source_system text not null,
  source_id text not null,
  author text not null,
  ownership_status text not null,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(problem, ''))
  ) stored,
  constraint laboratory_experiments_status_check check (editorial_status in ('draft', 'review', 'published', 'archived')),
  constraint laboratory_experiments_plan_check check (required_plan in ('free', 'pro_founder')),
  constraint laboratory_experiments_source_key unique (source_system, source_id)
);
create trigger laboratory_experiments_set_updated_at
before update on public.laboratory_experiments
for each row execute function public.set_updated_at();
create index laboratory_experiments_search_idx on public.laboratory_experiments using gin (search_document);
create table public.community_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  slug text unique,
  display_name text not null,
  photo_path text,
  description text,
  specialties text[] not null default '{}',
  location text,
  links jsonb not null default '[]'::jsonb,
  availability text,
  publication_status text not null default 'draft',
  consented_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_profiles_slug_check check (slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint community_profiles_status_check check (publication_status in ('draft', 'review', 'published', 'hidden')),
  constraint community_profiles_consent_check check (publication_status <> 'published' or consented_at is not null),
  constraint community_profiles_links_check check (jsonb_typeof(links) = 'array')
);
create trigger community_profiles_set_updated_at
before update on public.community_profiles
for each row execute function public.set_updated_at();
alter table public.content_categories enable row level security;
alter table public.content_tags enable row level security;
alter table public.library_resources enable row level security;
alter table public.library_resource_contents enable row level security;
alter table public.library_resource_tags enable row level security;
alter table public.library_favorites enable row level security;
alter table public.library_history enable row level security;
alter table public.academy_tracks enable row level security;
alter table public.academy_courses enable row level security;
alter table public.academy_modules enable row level security;
alter table public.academy_lessons enable row level security;
alter table public.academy_lesson_progress enable row level security;
alter table public.laboratory_experiments enable row level security;
alter table public.community_profiles enable row level security;
create policy content_categories_read on public.content_categories for select to anon, authenticated using (true);
create policy content_tags_read on public.content_tags for select to anon, authenticated using (true);
create policy library_resources_read_published on public.library_resources for select to anon, authenticated using (editorial_status = 'published' or public.is_super_admin());
create policy library_resource_contents_read_entitled on public.library_resource_contents for select to anon, authenticated using (
  exists (
    select 1 from public.library_resources as resource
    where resource.id = resource_id
      and resource.editorial_status = 'published'
      and public.can_access_content(
        resource.required_plan,
        nullif((coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb ->> 'x-organization-id'), '')::uuid
      )
  ) or public.is_super_admin()
);
create policy library_resource_tags_read_published on public.library_resource_tags for select to anon, authenticated using (
  exists (select 1 from public.library_resources where id = resource_id and editorial_status = 'published')
);
create policy library_favorites_own on public.library_favorites for all to authenticated
using (user_id = auth.uid() and public.is_organization_member(organization_id))
with check (user_id = auth.uid() and public.is_organization_member(organization_id));
create policy library_history_own on public.library_history for select to authenticated
using (user_id = auth.uid() and public.is_organization_member(organization_id));
create policy academy_tracks_read_published on public.academy_tracks for select to anon, authenticated using (editorial_status = 'published' or public.is_super_admin());
create policy academy_courses_read_published on public.academy_courses for select to anon, authenticated using (editorial_status = 'published' or public.is_super_admin());
create policy academy_modules_read_published on public.academy_modules for select to anon, authenticated using (
  exists (select 1 from public.academy_courses where id = course_id and editorial_status = 'published') or public.is_super_admin()
);
create policy academy_lessons_read_entitled on public.academy_lessons for select to anon, authenticated using (
  editorial_status = 'published'
  and public.can_access_content(
    required_plan,
    nullif((coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb ->> 'x-organization-id'), '')::uuid
  )
  or public.is_super_admin()
);
create policy academy_lesson_progress_own on public.academy_lesson_progress for all to authenticated
using (user_id = auth.uid() and public.is_organization_member(organization_id))
with check (user_id = auth.uid() and public.is_organization_member(organization_id));
create policy laboratory_experiments_read_entitled on public.laboratory_experiments for select to anon, authenticated using (
  editorial_status = 'published'
  and public.can_access_content(
    required_plan,
    nullif((coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb ->> 'x-organization-id'), '')::uuid
  )
  or public.is_super_admin()
);
create policy community_profiles_read_published on public.community_profiles for select to anon, authenticated using (publication_status = 'published' or user_id = auth.uid() or public.is_super_admin());
create policy community_profiles_insert_own on public.community_profiles for insert to authenticated with check (user_id = auth.uid() and publication_status in ('draft', 'review'));
create policy community_profiles_update_own on public.community_profiles for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and publication_status in ('draft', 'review'));
-- Editorial CRUD is available only to global administrators. Server and DB
-- checks remain authoritative even when an admin route is hidden in the UI.
create policy library_resources_admin_all on public.library_resources for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy library_resource_contents_admin_all on public.library_resource_contents for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy library_resource_tags_admin_all on public.library_resource_tags for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy academy_tracks_admin_all on public.academy_tracks for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy academy_courses_admin_all on public.academy_courses for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy academy_modules_admin_all on public.academy_modules for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy academy_lessons_admin_all on public.academy_lessons for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy laboratory_experiments_admin_all on public.laboratory_experiments for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy community_profiles_admin_all on public.community_profiles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
grant select on table public.content_categories, public.content_tags, public.library_resources,
  public.library_resource_contents, public.library_resource_tags, public.academy_tracks,
  public.academy_courses, public.academy_modules, public.academy_lessons,
  public.laboratory_experiments, public.community_profiles to anon, authenticated;
grant select, insert, delete on table public.library_favorites to authenticated;
grant select on table public.library_history to authenticated;
grant select, insert, update on table public.academy_lesson_progress to authenticated;
grant insert, update on table public.community_profiles to authenticated;
grant insert, update, delete on table public.library_resources, public.library_resource_contents,
  public.library_resource_tags, public.academy_tracks, public.academy_courses,
  public.academy_modules, public.academy_lessons, public.laboratory_experiments to authenticated;
grant all on table public.content_categories, public.content_tags,
  public.library_resources, public.library_resource_contents,
  public.library_resource_tags, public.library_favorites, public.library_history,
  public.academy_tracks, public.academy_courses, public.academy_modules,
  public.academy_lessons, public.academy_lesson_progress,
  public.laboratory_experiments, public.community_profiles to service_role;
comment on table public.library_resource_contents is
  'Entitlement-protected resource bodies; metadata remains in library_resources.';
comment on table public.community_profiles is
  'Opt-in professional directory. Publication requires explicit consent and editorial review.';
