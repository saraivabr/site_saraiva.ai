import type { SourceItem } from '../types';

const PH_RSS_URL = 'https://www.producthunt.com/feed?category=artificial-intelligence';

export async function fetchProductHunt(limit = 10): Promise<SourceItem[]> {
  try {
    const res = await fetch(PH_RSS_URL);
    const xml = await res.text();

    const items: SourceItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const itemXml = match[1];
      const title = extractTag(itemXml, 'title');
      const link = extractTag(itemXml, 'link');
      const description = extractTag(itemXml, 'description');
      const pubDate = extractTag(itemXml, 'pubDate');

      if (title && link) {
        items.push({
          title: decodeEntities(title),
          url: link,
          description: description ? decodeEntities(description).slice(0, 200) : title,
          source: 'Product Hunt',
          date: pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    }

    return items;
  } catch (err) {
    console.error('Product Hunt fetch failed:', err);
    return [];
  }
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's');
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
