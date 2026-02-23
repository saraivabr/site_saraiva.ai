import type { ContentCategory, SourceItem } from './types';

const CATEGORY_KEYWORDS: Record<ContentCategory, string[]> = {
  tool: ['tool', 'app', 'platform', 'software', 'launch', 'release', 'ferramenta', 'review', 'product', 'startup', 'api'],
  prompt: ['prompt', 'template', 'example', 'cheat sheet', 'modelo', 'exemplo', 'how to', 'guide', 'tutorial', 'step by step'],
  analysis: ['comparison', 'versus', 'benchmark', 'analysis', 'study', 'research', 'comparação', 'análise', 'news', 'update', 'trend', 'report'],
  thought: ['opinion', 'future', 'ethics', 'impact', 'will', 'should', 'opinião', 'futuro', 'ética', 'prediction'],
};

const SOURCE_BIAS: Record<string, ContentCategory> = {
  'Futurepedia': 'tool',
  'Product Hunt': 'tool',
  'Hacker News': 'analysis',
  'The Rundown AI': 'analysis',
  'Anthropic Blog': 'analysis',
  'OpenAI Blog': 'analysis',
  'Google AI Blog': 'analysis',
  'Hugging Face Blog': 'tool',
};

export function categorize(item: SourceItem): ContentCategory {
  const text = `${item.title} ${item.description}`.toLowerCase();

  const scores: Record<ContentCategory, number> = {
    tool: 0,
    prompt: 0,
    analysis: 0,
    thought: 0,
  };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        scores[category as ContentCategory] += 1;
      }
    }
  }

  const sourceBias = SOURCE_BIAS[item.source];
  if (sourceBias) {
    scores[sourceBias] += 2;
  }

  let bestCategory: ContentCategory = 'analysis';
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat as ContentCategory;
    }
  }

  return bestCategory;
}
