import matter from 'gray-matter';
import type { ContentItem, ContentMeta, Category } from '@/types/content';

const modules = import.meta.glob('/src/content/**/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

let _cache: ContentItem[] | null = null;

function parseAllContent(): ContentItem[] {
  if (_cache) return _cache;

  const items: ContentItem[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    try {
      const { data, content } = matter(raw);
      const meta = data as ContentMeta;
      if (meta.title && meta.slug && meta.category) {
        items.push({ meta, content, path });
      }
    } catch {
      console.warn(`Failed to parse: ${path}`);
    }
  }

  items.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
  _cache = items;
  return items;
}

export function getAllContent(): ContentItem[] {
  return parseAllContent();
}

export function getByCategory(category: Category): ContentItem[] {
  return parseAllContent().filter(item => item.meta.category === category);
}

export function getBySlug(category: Category, slug: string): ContentItem | undefined {
  return parseAllContent().find(
    item => item.meta.category === category && item.meta.slug === slug
  );
}

export function getByTag(tag: string): ContentItem[] {
  return parseAllContent().filter(item =>
    item.meta.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function searchContent(query: string): ContentItem[] {
  const q = query.toLowerCase();
  return parseAllContent().filter(item =>
    item.meta.title.toLowerCase().includes(q) ||
    item.meta.description.toLowerCase().includes(q) ||
    item.meta.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getFeatured(): ContentItem[] {
  return parseAllContent().filter(item => item.meta.featured);
}

export function getRelated(current: ContentItem, limit = 3): ContentItem[] {
  const all = parseAllContent().filter(i => i.meta.slug !== current.meta.slug);
  const scored = all.map(item => {
    let score = 0;
    if (item.meta.category === current.meta.category) score += 2;
    const sharedTags = item.meta.tags.filter(t => current.meta.tags.includes(t));
    score += sharedTags.length;
    return { item, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.item);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  parseAllContent().forEach(item => item.meta.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}
