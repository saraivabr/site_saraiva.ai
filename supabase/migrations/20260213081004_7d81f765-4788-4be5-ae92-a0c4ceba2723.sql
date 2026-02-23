
-- Add image_url and website_url columns to contents table
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS pricing text;
