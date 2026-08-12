-- Templates da base de referência não pertencem à oferta Saraiva.AI.
delete from public.editorial_templates
where source_system <> 'saraiva-template';

-- As notícias usam o sistema visual próprio da Saraiva.AI. Imagens e capas da
-- identidade anterior não devem permanecer disponíveis no catálogo público.
update public.editorial_articles
set image_url = null,
    updated_at = now()
where source_system = 'creative-ai-public';

update public.editorial_posts
set cover_image_url = null,
    updated_at = now()
where source_system = 'creative-ai-public';

