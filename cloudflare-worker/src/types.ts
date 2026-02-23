export interface Env {
  ANTHROPIC_API_KEY: string;
  HF_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ARTICLES_PER_RUN: string;
  CONTENT_LANG: string;
  CONTENT_PROCESSED: KVNamespace;
}

export interface SourceItem {
  title: string;
  url: string;
  description: string;
  source: string;
  date: string;
}

export type ContentCategory = 'prompt' | 'tool' | 'analysis' | 'thought';

export interface GeneratedArticle {
  title: string;
  slug: string;
  category: ContentCategory;
  description: string;
  tags: string[];
  body: string;
  sourceUrl: string;
  pricing?: 'Free' | 'Freemium' | 'Paid' | null;
  image_url?: string | null;
  featured?: boolean;
}

export interface DeduplicationEntry {
  slug: string;
  date: string;
  category: ContentCategory;
}
