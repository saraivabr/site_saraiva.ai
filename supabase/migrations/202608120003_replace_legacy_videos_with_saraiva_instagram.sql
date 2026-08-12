-- Remove do catálogo público os vídeos trazidos da base de referência.
-- A Saraiva.AI publica nesta superfície apenas mídia de sua própria conta.
delete from public.editorial_videos
where source_system <> 'saraiva-video';

delete from public.editorial_reels
where source_system <> 'saraiva-instagram';

insert into public.editorial_reels (
  id, shortcode, url, caption, thumbnail_url, video_url, username,
  likes, comments, views, duration, posted_at, display_order,
  is_published, source_system, source_id, source_created_at,
  source_updated_at, imported_at, created_at, updated_at
)
values
  (
    'a195ff1e-efeb-490c-9f1b-f41d70f2a361',
    'DbWjoU-iTih',
    'https://www.instagram.com/reel/DbWjoU-iTih/',
    E'FAÇA R$500 POR DIA VENDENDO MÚSICA COM IA. 🎵\n\nO vídeo mostra uma operação simples: encontrar negócios locais, criar um jingle personalizado com IA e transformar a criação em uma oferta honesta.',
    'https://vvirmwosoqkleyihckyc.supabase.co/storage/v1/object/public/editorial-public/instagram/reels/DbWjoU-iTih.jpg',
    null,
    'saraiva.ai', 0, 0, 2, null,
    '2026-07-28T21:57:23+00:00', 1, true,
    'saraiva-instagram',
    'a195ff1e-efeb-490c-9f1b-f41d70f2a361',
    '2026-07-28T21:57:23+00:00', now(), now(), now(), now()
  ),
  (
    '8aef87b0-154a-48d6-835d-532581529909',
    'DbW56LpCtif',
    'https://www.instagram.com/reel/DbW56LpCtif/',
    E'Faça ligações em massa para seus clientes usando o WhatsApp — sem montar um call center. A Ligação.ai executa as conversas e organiza quem demonstrou interesse, pediu proposta ou precisa de retorno.',
    'https://vvirmwosoqkleyihckyc.supabase.co/storage/v1/object/public/editorial-public/instagram/reels/DbW56LpCtif.jpg',
    null,
    'saraiva.ai', 13, 12, 661, null,
    '2026-07-29T01:12:24+00:00', 2, true,
    'saraiva-instagram',
    '8aef87b0-154a-48d6-835d-532581529909',
    '2026-07-29T01:12:24+00:00', now(), now(), now(), now()
  ),
  (
    '4e37af4c-841d-4b68-a41e-ff39370f7a29',
    'DbXK1EXiRxs',
    'https://www.instagram.com/reel/DbXK1EXiRxs/',
    E'Um motor para encontrar empresas e transformar oportunidades em propostas: dados públicos, briefing, abordagem, preço, contrato, pagamento e entrega organizados em um só fluxo.',
    'https://vvirmwosoqkleyihckyc.supabase.co/storage/v1/object/public/editorial-public/instagram/reels/DbXK1EXiRxs.jpg',
    null,
    'saraiva.ai', 2, 0, 220, null,
    '2026-07-29T03:40:03+00:00', 3, true,
    'saraiva-instagram',
    '4e37af4c-841d-4b68-a41e-ff39370f7a29',
    '2026-07-29T03:40:03+00:00', now(), now(), now(), now()
  )
on conflict (id) do update set
  shortcode = excluded.shortcode,
  url = excluded.url,
  caption = excluded.caption,
  thumbnail_url = excluded.thumbnail_url,
  video_url = excluded.video_url,
  username = excluded.username,
  likes = excluded.likes,
  comments = excluded.comments,
  views = excluded.views,
  posted_at = excluded.posted_at,
  display_order = excluded.display_order,
  is_published = true,
  source_system = excluded.source_system,
  source_updated_at = excluded.source_updated_at,
  updated_at = now();
