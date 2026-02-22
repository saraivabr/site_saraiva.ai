import type { SourceItem } from '../types';

const FUTUREPEDIA_URL = 'https://www.futurepedia.io/api/tools?sort=new&limit=20';
const FUTUREPEDIA_FALLBACK = 'https://www.futurepedia.io/';

export async function fetchFuturepedia(limit = 10): Promise<SourceItem[]> {
  try {
    const res = await fetch(FUTUREPEDIA_URL, {
      headers: {
        'User-Agent': 'SaraivaAI-ContentBot/1.0',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return fetchFuturepediaFallback(limit);
    }

    const data = await res.json() as { tools?: Array<{ name: string; url: string; description: string; createdAt?: string }> };
    const tools = data.tools || [];

    return tools.slice(0, limit).map(tool => ({
      title: `Nova ferramenta: ${tool.name}`,
      url: tool.url || FUTUREPEDIA_FALLBACK,
      description: tool.description || tool.name,
      source: 'Futurepedia',
      date: tool.createdAt ? new Date(tool.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('Futurepedia fetch failed:', err);
    return fetchFuturepediaFallback(limit);
  }
}

async function fetchFuturepediaFallback(limit: number): Promise<SourceItem[]> {
  try {
    const res = await fetch('https://www.futurepedia.io/ai-tools', {
      headers: { 'User-Agent': 'SaraivaAI-ContentBot/1.0' },
    });
    const html = await res.text();

    const items: SourceItem[] = [];
    const titleRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/g;
    let match;

    while ((match = titleRegex.exec(html)) !== null && items.length < limit) {
      const title = match[1].trim();
      if (title.length > 3 && title.length < 100) {
        items.push({
          title: `Nova ferramenta: ${title}`,
          url: FUTUREPEDIA_FALLBACK,
          description: title,
          source: 'Futurepedia',
          date: new Date().toISOString().split('T')[0],
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}
