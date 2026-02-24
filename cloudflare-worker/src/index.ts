import type { Env, SourceItem } from './types';
import { fetchHackerNews } from './sources/hackernews';
import { fetchProductHunt } from './sources/producthunt';
import { fetchRSSFeeds } from './sources/rss';
import { fetchFuturepedia } from './sources/futurepedia';
import { fetchRundown } from './sources/rundown';
import { filterNew, markProcessed } from './dedup';
import { categorize } from './categorizer';
import { generateArticle } from './content-generator';
import { generateImage } from './image-generator';
import { publishToSupabase, uploadImageToSupabase } from './supabase';
import { evaluateQuality } from './quality-scorer';

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runContentPipeline(env));
    console.log(`Cron triggered at ${new Date(controller.scheduledTime).toISOString()}`);
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/run' && request.method === 'POST') {
      const result = await runContentPipeline(env);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Saraiva.AI Content Bot', { status: 200 });
  },
};

async function runContentPipeline(env: Env): Promise<{ success: boolean; articlesPublished: number; errors: string[] }> {
  const errors: string[] = [];
  let articlesPublished = 0;
  const maxArticles = parseInt(env.ARTICLES_PER_RUN || '3');

  console.log('Starting content pipeline...');

  // 1. Fetch from all sources in parallel
  const [hnItems, phItems, rssItems, fpItems, rdItems] = await Promise.allSettled([
    fetchHackerNews(10),
    fetchProductHunt(10),
    fetchRSSFeeds(10),
    fetchFuturepedia(10),
    fetchRundown(10),
  ]);

  const allItems: SourceItem[] = [];
  for (const result of [hnItems, phItems, rssItems, fpItems, rdItems]) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    } else {
      errors.push(`Source fetch failed: ${result.reason}`);
    }
  }

  console.log(`Fetched ${allItems.length} items from sources`);

  if (allItems.length === 0) {
    errors.push('No items fetched from any source');
    return { success: false, articlesPublished: 0, errors };
  }

  // 2. Filter out already processed items
  const newItems = await filterNew(allItems, env);
  console.log(`${newItems.length} new items after dedup`);

  if (newItems.length === 0) {
    return { success: true, articlesPublished: 0, errors };
  }

  // 3. Select top items (diverse categories)
  const selected = selectDiverse(newItems, maxArticles);
  console.log(`Selected ${selected.length} items for processing`);

  // 4. Process each selected item
  for (const item of selected) {
    try {
      // Quality check BEFORE processing
      const qualityScore = await evaluateQuality(item, env);
      console.log(`Quality score for "${item.title}": ${qualityScore.overall}/10 (relevance: ${qualityScore.relevance}, sentiment: ${qualityScore.sentiment})`);

      if (!qualityScore.shouldPublish) {
        console.log(`Skipping low-quality content: ${item.title}`);
        continue;
      }

      const category = categorize(item);
      console.log(`Generating article for: ${item.title} (${category})`);

      // Generate article content
      const article = await generateArticle(item, category, env);
      if (!article) {
        errors.push(`Failed to generate article for: ${item.title}`);
        continue;
      }

      // Upload image to Supabase Storage (if available)
      let imageUrl: string | null = null;
      try {
        const imageResult = await generateImage(article.title, article.slug, env);
        if (imageResult?.imageData) {
          imageUrl = await uploadImageToSupabase(imageResult.imageData, article.slug, env);
        }
      } catch (imgErr) {
        console.warn('Image generation skipped:', imgErr);
      }

      // Publish to Supabase
      const published = await publishToSupabase(article, imageUrl, env);
      if (published) {
        await markProcessed(item, article.slug, article.category, env);
        articlesPublished++;
        console.log(`Published: ${article.category}/${article.title}`);
      } else {
        errors.push(`Failed to publish: ${article.title}`);
      }
    } catch (err) {
      errors.push(`Processing error: ${err}`);
    }
  }

  console.log(`Pipeline complete: ${articlesPublished} articles published`);
  return { success: true, articlesPublished, errors };
}

function selectDiverse(items: SourceItem[], count: number): SourceItem[] {
  // Sort by date (newest first) and pick from different sources
  const sorted = [...items].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const selected: SourceItem[] = [];
  const usedSources = new Set<string>();

  // First pass: one from each source
  for (const item of sorted) {
    if (selected.length >= count) break;
    if (!usedSources.has(item.source)) {
      selected.push(item);
      usedSources.add(item.source);
    }
  }

  // Second pass: fill remaining slots with newest items
  for (const item of sorted) {
    if (selected.length >= count) break;
    if (!selected.includes(item)) {
      selected.push(item);
    }
  }

  return selected;
}
