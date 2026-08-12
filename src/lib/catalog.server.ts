import "server-only";

import type {
  Article,
  BlogPost,
  CatalogTag,
  CatalogTemplate,
  CatalogTool,
  CatalogVideo,
  InstagramVideo,
} from "@/components/saraiva/catalog/data";
import { sanitizeLegacyBrandText } from "@/components/saraiva/catalog/data";

const REVALIDATE_SECONDS = 300;

type ToolWithRelations = Omit<CatalogTool, "tags"> & {
  tool_tags?: Array<{ tags: CatalogTag | null }>;
};

type ToolSummaryWithRelations = Pick<
  CatalogTool,
  "id" | "name" | "slug" | "short_description" | "screenshot_url"
> & {
  tool_tags?: Array<{ tags: CatalogTag | null }>;
};

function catalogConfig() {
  const url = process.env.SUPABASE_CATALOG_URL;
  const key = process.env.SUPABASE_CATALOG_ANON_KEY;
  if (!url || !key) throw new Error("Catálogo indisponível: configuração ausente");
  return { url: url.replace(/\/$/, ""), key };
}

async function query<T>(path: string): Promise<T[]> {
  if (process.env.CATALOG_FORCE_FAILURE === "true") {
    throw new Error("Falha controlada do catálogo");
  }
  const { url, key } = catalogConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["catalogo-publico"] },
  });
  if (!response.ok) throw new Error(`Catálogo indisponível (${response.status})`);
  return (await response.json()) as T[];
}

function encodeSlug(slug: string) {
  return encodeURIComponent(slug.replace(/[^a-z0-9-]/gi, ""));
}

function normalizeTool(tool: ToolWithRelations): CatalogTool {
  const { tool_tags: relations = [], ...fields } = tool;
  return {
    ...fields,
    url: fields.url,
    tags: relations.flatMap((relation) => relation.tags ? [relation.tags] : []),
  };
}

function normalizeToolSummary(tool: ToolSummaryWithRelations): CatalogTool {
  return {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    short_description: tool.short_description,
    description: "",
    url: "",
    screenshot_url: tool.screenshot_url,
    video_url: null,
    pricing_type: null,
    additional_context: null,
    headquarters: null,
    country_code: null,
    user_reviews: null,
    tags: (tool.tool_tags ?? []).flatMap((relation) => relation.tags ? [relation.tags] : []),
  };
}

export async function getHomeData() {
  try {
    const [tools, tags] = await Promise.all([
      query<ToolSummaryWithRelations>("tools?select=id,name,slug,short_description,screenshot_url,tool_tags(tags(id,name,slug))&is_published=eq.true&order=is_featured.desc,created_at.desc"),
      query<CatalogTag>("tags?select=id,name,slug&order=name.asc"),
    ]);
    return { tools: tools.map(normalizeToolSummary), tags, available: true };
  } catch (error) {
    console.error("Falha ao carregar catálogo público", error instanceof Error ? error.message : "erro desconhecido");
    return { tools: [] as CatalogTool[], tags: [] as CatalogTag[], available: false };
  }
}

export async function getToolBySlug(slug: string) {
  const rows = await query<ToolWithRelations>(`tools?select=*,tool_tags(tags(id,name,slug))&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  return rows[0] ? normalizeTool(rows[0]) : null;
}

export async function getTemplates() {
  return query<CatalogTemplate>("templates_public?select=*&is_published=eq.true&order=display_order.asc");
}

export async function getTemplateBySlug(slug: string) {
  const rows = await query<CatalogTemplate>(`templates_public?select=*&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  return rows[0] ?? null;
}

export async function getEditorialData() {
  const [articles, posts, videos, reels] = await Promise.all([
    query<Article>("articles?select=*&is_published=eq.true&order=published_at.desc"),
    query<Omit<BlogPost, "tags">>("blog_posts?select=*&is_published=eq.true&order=published_at.desc"),
    query<CatalogVideo>("videos?select=*&is_published=eq.true&order=published_at.desc"),
    query<InstagramVideo>("instagram_videos?select=*&is_published=eq.true&order=posted_at.desc"),
  ]);
  return {
    articles: articles.map((article) => ({ ...article, title: sanitizeLegacyBrandText(article.title), summary: sanitizeLegacyBrandText(article.summary), story_content: sanitizeLegacyBrandText(article.story_content), content_text: sanitizeLegacyBrandText(article.content_text) })),
    posts: posts.map((post) => ({ ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), content_html: sanitizeLegacyBrandText(post.content_html), tags: [] })),
    videos: videos.map((video) => ({ ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) })),
    reels: reels.map((reel) => ({ ...reel, caption: sanitizeLegacyBrandText(reel.caption), username: sanitizeLegacyBrandText(`@${reel.username}`).replace(/^@/, "") })),
  };
}

export async function getArticleBySlug(slug: string) {
  const rows = await query<Article>(`articles?select=*&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  const article = rows[0];
  return article ? { ...article, title: sanitizeLegacyBrandText(article.title), summary: sanitizeLegacyBrandText(article.summary), story_content: sanitizeLegacyBrandText(article.story_content), content_text: sanitizeLegacyBrandText(article.content_text) } : null;
}

export async function getPostBySlug(slug: string) {
  const rows = await query<Omit<BlogPost, "tags">>(`blog_posts?select=*&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  const post = rows[0];
  return post ? { ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), content_html: sanitizeLegacyBrandText(post.content_html), tags: [] } : null;
}

export async function getVideoBySlug(slug: string) {
  const rows = await query<CatalogVideo>(`videos?select=*&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  const video = rows[0];
  return video ? { ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) } : null;
}
