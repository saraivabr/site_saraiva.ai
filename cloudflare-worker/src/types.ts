export interface Env {
  ANTHROPIC_API_KEY: string;
  HF_TOKEN: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
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

export interface GeneratedArticle {
  title: string;
  slug: string;
  category: Category;
  description: string;
  tags: string[];
  content: string;
  sourceUrl: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  rating?: number;
  pricing?: 'free' | 'freemium' | 'paid';
}

export type Category = 'blog' | 'tutoriais' | 'ferramentas' | 'prompts' | 'analises' | 'pensamentos';

export interface DeduplicationEntry {
  slug: string;
  date: string;
  category: Category;
}
