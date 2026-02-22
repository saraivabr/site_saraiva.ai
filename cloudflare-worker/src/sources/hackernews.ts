import type { SourceItem } from '../types';

const HN_TOP_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item';

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt',
  'claude', 'openai', 'anthropic', 'google ai', 'gemini', 'transformer',
  'neural', 'deep learning', 'chatbot', 'generative', 'diffusion',
  'agent', 'copilot', 'midjourney', 'stable diffusion', 'hugging face',
];

function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some(kw => lower.includes(kw));
}

export async function fetchHackerNews(limit = 10): Promise<SourceItem[]> {
  try {
    const res = await fetch(HN_TOP_URL);
    const ids: number[] = await res.json();
    const topIds = ids.slice(0, 60);

    const items = await Promise.all(
      topIds.map(async (id) => {
        const itemRes = await fetch(`${HN_ITEM_URL}/${id}.json`);
        return itemRes.json();
      })
    );

    return items
      .filter((item: { title?: string; url?: string }) => item.title && item.url && isAIRelated(item.title))
      .slice(0, limit)
      .map((item: { title: string; url: string; time: number }) => ({
        title: item.title,
        url: item.url,
        description: item.title,
        source: 'Hacker News',
        date: new Date(item.time * 1000).toISOString().split('T')[0],
      }));
  } catch (err) {
    console.error('HN fetch failed:', err);
    return [];
  }
}
