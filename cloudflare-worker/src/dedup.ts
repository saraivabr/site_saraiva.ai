import type { Env, DeduplicationEntry, SourceItem } from './types';

const TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `url_${Math.abs(hash).toString(36)}`;
}

export async function isProcessed(item: SourceItem, env: Env): Promise<boolean> {
  const key = hashUrl(item.url);
  const existing = await env.CONTENT_PROCESSED.get(key);
  return existing !== null;
}

export async function markProcessed(
  item: SourceItem,
  slug: string,
  category: string,
  env: Env
): Promise<void> {
  const key = hashUrl(item.url);
  const entry: DeduplicationEntry = {
    slug,
    date: new Date().toISOString().split('T')[0],
    category: category as DeduplicationEntry['category'],
  };
  await env.CONTENT_PROCESSED.put(key, JSON.stringify(entry), {
    expirationTtl: TTL_SECONDS,
  });
}

export async function filterNew(items: SourceItem[], env: Env): Promise<SourceItem[]> {
  const results = await Promise.all(
    items.map(async (item) => ({
      item,
      processed: await isProcessed(item, env),
    }))
  );
  return results.filter(r => !r.processed).map(r => r.item);
}
