update public.editorial_posts
set
  is_published = false,
  updated_at = now()
where source_system = 'creative-ai-public'
  and is_published = true;

drop policy if exists "published editorial articles are public" on public.editorial_articles;
create policy "approved owned editorial articles are public"
  on public.editorial_articles
  for select
  using (is_published and source_system = 'saraiva-owned');

drop policy if exists "published editorial posts are public" on public.editorial_posts;
create policy "approved owned editorial posts are public"
  on public.editorial_posts
  for select
  using (is_published and source_system = 'saraiva-owned');
