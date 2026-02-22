import type { Category, SourceItem } from './types';

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  ferramentas: ['tool', 'app', 'platform', 'software', 'launch', 'release', 'ferramenta', 'review', 'product'],
  tutoriais: ['how to', 'guide', 'tutorial', 'step by step', 'getting started', 'como', 'guia', 'passo'],
  blog: ['news', 'update', 'announce', 'report', 'trend', 'notícia', 'novidade', 'lançamento'],
  analises: ['comparison', 'versus', 'benchmark', 'analysis', 'study', 'research', 'comparação', 'análise'],
  prompts: ['prompt', 'template', 'example', 'cheat sheet', 'modelo', 'exemplo'],
  pensamentos: ['opinion', 'future', 'ethics', 'impact', 'will', 'should', 'opinião', 'futuro', 'ética'],
};

const SOURCE_BIAS: Record<string, Category> = {
  'Futurepedia': 'ferramentas',
  'Product Hunt': 'ferramentas',
  'Hacker News': 'blog',
  'The Rundown AI': 'blog',
  'Anthropic Blog': 'blog',
  'OpenAI Blog': 'blog',
  'Google AI Blog': 'blog',
  'Hugging Face Blog': 'blog',
};

export function categorize(item: SourceItem): Category {
  const text = `${item.title} ${item.description}`.toLowerCase();

  const scores: Record<Category, number> = {
    blog: 0,
    tutoriais: 0,
    ferramentas: 0,
    prompts: 0,
    analises: 0,
    pensamentos: 0,
  };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        scores[category as Category] += 1;
      }
    }
  }

  const sourceBias = SOURCE_BIAS[item.source];
  if (sourceBias) {
    scores[sourceBias] += 2;
  }

  let bestCategory: Category = 'blog';
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat as Category;
    }
  }

  return bestCategory;
}
