create table if not exists public.editorial_tools (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  url text not null,
  screenshot_url text,
  video_url text,
  pricing_type text,
  additional_context text,
  headquarters text,
  country_code text,
  user_reviews text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_tags (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.editorial_tool_tags (
  tool_id uuid not null references public.editorial_tools(id) on delete cascade,
  tag_id uuid not null references public.editorial_tags(id) on delete cascade,
  source_system text not null default 'creative-ai-public',
  imported_at timestamptz not null default now(),
  primary key (tool_id, tag_id)
);

create table if not exists public.editorial_articles (
  id uuid primary key,
  slug text not null unique,
  url text not null,
  title text not null,
  summary text not null default '',
  image_url text,
  author text,
  source_name text,
  source_domain text,
  published_at timestamptz,
  display_order integer not null default 0,
  content_html text,
  content_text text not null default '',
  word_count integer,
  reading_time_minutes integer,
  story_content text,
  story_generated_at timestamptz,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_posts (
  id uuid primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content_html text not null default '',
  cover_image_url text,
  language text,
  published_at timestamptz,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_videos (
  id uuid primary key,
  slug text not null unique,
  youtube_id text not null,
  title text not null,
  description text not null default '',
  thumbnail_url text,
  video_url text not null,
  views bigint,
  duration integer,
  published_at timestamptz,
  display_order integer not null default 0,
  summary text,
  story_content text,
  story_generated_at timestamptz,
  transcript text,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_reels (
  id uuid primary key,
  shortcode text,
  url text not null,
  caption text not null default '',
  thumbnail_url text,
  video_url text,
  username text,
  likes bigint,
  comments bigint,
  views bigint,
  duration numeric,
  posted_at timestamptz,
  display_order integer not null default 0,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_templates (
  id uuid primary key,
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  category text,
  tech_stack text[] not null default '{}',
  features text[] not null default '{}',
  use_cases text[] not null default '{}',
  external_integrations jsonb not null default '[]'::jsonb,
  lovable_url text,
  image_url text,
  price_cents integer,
  display_order integer not null default 0,
  is_published boolean not null default false,
  source_system text not null default 'creative-ai-public',
  source_id uuid not null unique,
  source_created_at timestamptz,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists editorial_tools_published_idx on public.editorial_tools (is_published, is_featured desc, created_at desc);
create index if not exists editorial_articles_published_idx on public.editorial_articles (is_published, published_at desc nulls last, display_order);
create index if not exists editorial_posts_published_idx on public.editorial_posts (is_published, published_at desc nulls last);
create index if not exists editorial_videos_published_idx on public.editorial_videos (is_published, published_at desc nulls last, display_order);
create index if not exists editorial_reels_published_idx on public.editorial_reels (is_published, posted_at desc nulls last, display_order);
create index if not exists editorial_templates_published_idx on public.editorial_templates (is_published, display_order);

alter table public.editorial_tools enable row level security;
alter table public.editorial_tags enable row level security;
alter table public.editorial_tool_tags enable row level security;
alter table public.editorial_articles enable row level security;
alter table public.editorial_posts enable row level security;
alter table public.editorial_videos enable row level security;
alter table public.editorial_reels enable row level security;
alter table public.editorial_templates enable row level security;

revoke all on table public.editorial_tools, public.editorial_tags, public.editorial_tool_tags, public.editorial_articles, public.editorial_posts, public.editorial_videos, public.editorial_reels, public.editorial_templates from anon, authenticated;
grant select on table public.editorial_tools, public.editorial_tags, public.editorial_tool_tags, public.editorial_articles, public.editorial_posts, public.editorial_videos, public.editorial_reels, public.editorial_templates to anon, authenticated;
grant all on table public.editorial_tools, public.editorial_tags, public.editorial_tool_tags, public.editorial_articles, public.editorial_posts, public.editorial_videos, public.editorial_reels, public.editorial_templates to service_role;

create policy "published editorial tools are public" on public.editorial_tools for select using (is_published);
create policy "editorial tags are public" on public.editorial_tags for select using (true);
create policy "published editorial tool tags are public" on public.editorial_tool_tags for select using (exists (select 1 from public.editorial_tools where editorial_tools.id = editorial_tool_tags.tool_id and editorial_tools.is_published));
create policy "published editorial articles are public" on public.editorial_articles for select using (is_published);
create policy "published editorial posts are public" on public.editorial_posts for select using (is_published);
create policy "published editorial videos are public" on public.editorial_videos for select using (is_published);
create policy "published editorial reels are public" on public.editorial_reels for select using (is_published);
create policy "published editorial templates are public" on public.editorial_templates for select using (is_published);

comment on table public.editorial_tools is 'Catálogo editorial público da Saraiva.AI, importado com procedência e administrado no projeto próprio.';
comment on table public.editorial_articles is 'Artigos editoriais públicos da Saraiva.AI; nenhum perfil ou dado privado é importado.';
comment on table public.editorial_posts is 'Posts editoriais públicos da Saraiva.AI.';
comment on table public.editorial_videos is 'Vídeos públicos da Saraiva.AI.';
comment on table public.editorial_reels is 'Reels públicos da Saraiva.AI.';
comment on table public.editorial_templates is 'Templates públicos da Saraiva.AI.';
