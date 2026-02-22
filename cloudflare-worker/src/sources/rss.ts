import type { SourceItem } from '../types';

const RSS_FEEDS = [
  { url: 'https://blog.anthropic.com/rss.xml', name: 'Anthropic Blog' },
  { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI Blog' },
  { url: 'https://blog.google/technology/ai/rss/', name: 'Google AI Blog' },
  { url: 'https://huggingface.co/blog/feed.xml', name: 'Hugging Face Blog' },
];

export async function fetchRSSFeeds(limit = 10): Promise<SourceItem[]> {
  const allItems: SourceItem[] = [];

  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchSingleFeed(feed.url, feed.name))
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allItems.slice(0, limit);
}

async function fetchSingleFeed(url: string, sourceName: string): Promise<SourceItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SaraivaAI-ContentBot/1.0' },
    });
    const xml = await res.text();

    const items: SourceItem[] = [];
    const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const itemXml = match[1];
      const title = extractTag(itemXml, 'title');
      const link = extractLink(itemXml);
      const description = extractTag(itemXml, 'description') || extractTag(itemXml, 'summary') || '';
      const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'published') || extractTag(itemXml, 'updated');

      if (title && link) {
        items.push({
          title: decodeEntities(title),
          url: link,
          description: decodeEntities(description).replace(/<[^>]*>/g, '').slice(0, 200),
          source: sourceName,
          date: pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    }

    return items;
  } catch (err) {
    console.error(`RSS fetch failed for ${sourceName}:`, err);
    return [];
  }
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?</${tag}>`, 's');
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
}

function extractLink(xml: string): string | null {
  const linkTag = /<link[^>]*href="([^"]+)"[^>]*\/?>/.exec(xml);
  if (linkTag) return linkTag[1];
  const linkContent = extractTag(xml, 'link');
  return linkContent;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
