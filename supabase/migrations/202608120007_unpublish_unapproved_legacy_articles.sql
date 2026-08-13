-- The reference archive remains in Supabase for the authoring pipeline, but it
-- must not appear publicly until a substantially original Saraiva.AI article
-- has been written, reviewed and approved under source_system=saraiva-owned.
update public.editorial_articles
set
  is_published = false,
  updated_at = now()
where source_system = 'creative-ai-public'
  and is_published = true;
