import "server-only";

import type {
  Article,
  BlogPost,
  CatalogTag,
  CatalogTool,
  CatalogVideo,
  InstagramVideo,
} from "@/components/saraiva/catalog/data";
import { sanitizeLegacyBrandText } from "@/components/saraiva/catalog/data";
import { OWNED_ARTICLE_SLUG, ownedArticlePilot } from "@/lib/owned-article-pilot";

const REVALIDATE_SECONDS = 300;

type ToolWithRelations = Omit<CatalogTool, "tags"> & {
  editorial_tool_tags?: Array<{ editorial_tags: CatalogTag | null }>;
};

type ToolSummaryWithRelations = Pick<
  CatalogTool,
  "id" | "name" | "slug" | "short_description" | "screenshot_url"
> & {
  editorial_tool_tags?: Array<{ editorial_tags: CatalogTag | null }>;
};

function catalogConfig() {
  const url = process.env.SUPABASE_APP_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

function ownedImageUrl(imageUrl: string | null) {
  return imageUrl?.startsWith("/images/news/") ? imageUrl : null;
}

function normalizeArticle(article: Article): Article {
  const isOwned = article.source_system === "saraiva-owned";
  return {
    ...article,
    title: sanitizeLegacyBrandText(article.title),
    summary: sanitizeLegacyBrandText(article.summary),
    image_url: isOwned ? ownedImageUrl(article.image_url) : null,
    story_content: null,
    content_text: isOwned ? article.content_text : "",
    url: isOwned ? "" : article.url,
  };
}

function normalizeTool(tool: ToolWithRelations): CatalogTool {
  const { editorial_tool_tags: relations = [], ...fields } = tool;
  return {
    ...fields,
    url: fields.url,
    tags: relations.flatMap((relation) => relation.editorial_tags ? [relation.editorial_tags] : []),
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
    tags: (tool.editorial_tool_tags ?? []).flatMap((relation) => relation.editorial_tags ? [relation.editorial_tags] : []),
  };
}

export async function getHomeData() {
  try {
    const [tools, tags, articles, reels] = await Promise.all([
      query<ToolSummaryWithRelations>("editorial_tools?select=id,name,slug,short_description,screenshot_url,editorial_tool_tags(editorial_tags(id,name,slug))&is_published=eq.true&order=is_featured.desc,created_at.desc"),
      query<CatalogTag>("editorial_tags?select=id,name,slug&order=name.asc"),
      query<Article>("editorial_articles?select=id,slug,title,summary,image_url,author,source_name,source_system,published_at&is_published=eq.true&order=published_at.desc.nullslast,display_order.asc&limit=6"),
      query<InstagramVideo>("editorial_reels?select=id,url,caption,thumbnail_url,video_url,username,duration,posted_at&is_published=eq.true&source_system=eq.saraiva-instagram&order=posted_at.desc.nullslast,display_order.asc&limit=6"),
    ]);
    return { tools: tools.map(normalizeToolSummary), tags, articles: articles.map(normalizeArticle), reels, available: true };
  } catch (error) {
    console.error("Falha ao carregar catálogo público", error instanceof Error ? error.message : "erro desconhecido");
    return { tools: [] as CatalogTool[], tags: [] as CatalogTag[], articles: [] as Article[], reels: [] as InstagramVideo[], available: false };
  }
}

export async function getToolBySlug(slug: string) {
  const rows = await query<ToolWithRelations>(`editorial_tools?select=*,editorial_tool_tags(editorial_tags(id,name,slug))&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  return rows[0] ? normalizeTool(rows[0]) : null;
}

export async function getEditorialData() {
  const [articles, posts, videos, reels] = await Promise.all([
    query<Pick<Article, "id" | "slug" | "title" | "summary" | "image_url" | "author" | "source_name" | "source_system" | "published_at">>("editorial_articles?select=id,slug,title,summary,image_url,author,source_name,source_system,published_at&is_published=eq.true&order=published_at.desc.nullslast,display_order.asc"),
    query<Pick<BlogPost, "id" | "slug" | "title" | "excerpt" | "published_at">>("editorial_posts?select=id,slug,title,excerpt,published_at&is_published=eq.true&order=published_at.desc.nullslast"),
    query<CatalogVideo>("editorial_videos?select=*&is_published=eq.true&source_system=eq.saraiva-video&order=published_at.desc.nullslast,display_order.asc"),
    query<InstagramVideo>("editorial_reels?select=*&is_published=eq.true&source_system=eq.saraiva-instagram&order=posted_at.desc.nullslast,display_order.asc"),
  ]);
  return {
    articles: articles.map((article) => normalizeArticle({ ...article, story_content: null, content_text: "", url: "" })),
    posts: posts.map((post) => ({ ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), cover_image_url: null, content_html: "", tags: [] })),
    videos: videos.map((video) => ({ ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) })),
    reels: reels.map((reel) => ({ ...reel, caption: sanitizeLegacyBrandText(reel.caption), username: sanitizeLegacyBrandText(`@${reel.username}`).replace(/^@/, "") })),
  };
}

export async function getArticleBySlug(slug: string) {
  const isPreview = process.env.OWNED_ARTICLE_PREVIEW === "true" && slug === OWNED_ARTICLE_SLUG;
  let rows: Article[];
  try {
    rows = await query<Article>(`editorial_articles?select=id,slug,title,summary,image_url,author,source_name,source_system,published_at,url,content_text&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  } catch (error) {
    if (isPreview) return normalizeArticle(ownedArticlePilot);
    throw error;
  }
  const article = rows[0];
  if (article) return normalizeArticle(article);
  if (isPreview) return normalizeArticle(ownedArticlePilot);
  return null;
}

export async function getPostBySlug(slug: string) {
  const rows = await query<Omit<BlogPost, "tags">>(`editorial_posts?select=*&is_published=eq.true&slug=eq.${encodeSlug(slug)}&limit=1`);
  const post = rows[0];
  return post ? { ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), content_html: sanitizeLegacyBrandText(post.content_html), tags: [] } : null;
}

export async function getVideoBySlug(slug: string) {
  const rows = await query<CatalogVideo>(`editorial_videos?select=*&is_published=eq.true&source_system=eq.saraiva-video&slug=eq.${encodeSlug(slug)}&limit=1`);
  const video = rows[0];
  return video ? { ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) } : null;
}
