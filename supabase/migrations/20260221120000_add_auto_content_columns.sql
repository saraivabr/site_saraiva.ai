-- Add columns for auto-generated content from RSS feeds
ALTER TABLE contents ADD COLUMN IF NOT EXISTS source TEXT DEFAULT NULL;
ALTER TABLE contents ADD COLUMN IF NOT EXISTS source_url TEXT DEFAULT NULL;
ALTER TABLE contents ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT FALSE;
