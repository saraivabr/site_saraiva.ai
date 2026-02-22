export type Category = 'blog' | 'tutoriais' | 'ferramentas' | 'prompts' | 'analises' | 'pensamentos';

export type Difficulty = 'iniciante' | 'intermediario' | 'avancado';
export type Pricing = 'free' | 'freemium' | 'paid';

export interface ContentMeta {
  title: string;
  slug: string;
  category: Category;
  date: string;
  author: string;
  description: string;
  tags: string[];
  image?: string;
  source?: string;
  featured?: boolean;
  difficulty?: Difficulty;
  rating?: number;
  pricing?: Pricing;
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
  path: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'blog', label: 'Blog', description: 'Notícias e tendências de IA', icon: '📰' },
  { id: 'tutoriais', label: 'Tutoriais', description: 'Passo a passo prático', icon: '📖' },
  { id: 'ferramentas', label: 'Ferramentas', description: 'Reviews e comparativos', icon: '🛠️' },
  { id: 'prompts', label: 'Prompts', description: 'Templates prontos para uso', icon: '💡' },
  { id: 'analises', label: 'Análises', description: 'Análises profundas do mercado', icon: '📊' },
  { id: 'pensamentos', label: 'Pensamentos', description: 'Opinião e reflexão sobre IA', icon: '🧠' },
];
