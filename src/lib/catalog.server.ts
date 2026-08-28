import "server-only";

import type {
  Article,
  BlogPost,
  CatalogTag,
  CatalogTool,
  CatalogVideo,
  InstagramVideo,
  PublicOffer,
} from "@/components/saraiva/catalog/data";
import { sanitizeLegacyBrandText } from "@/components/saraiva/catalog/data";
import { sql } from "@/lib/db";
import { OWNED_ARTICLE_SLUG, ownedArticlePilot } from "@/lib/owned-article-pilot";

type ToolWithRelations = Omit<CatalogTool, "tags"> & { tags?: CatalogTag[] | null };

type ArticleRow = Pick<
  Article,
  "id" | "slug" | "title" | "summary" | "image_url" | "author" | "source_name" | "source_system" | "published_at"
> & Partial<Pick<Article, "story_content" | "content_text" | "url">>;

// Colunas públicas das ofertas. O SELECT é explícito de propósito: campos
// internos como potential e source_record_id nunca devem sair daqui.
const COLUNAS_OFERTA =
  "slug, name, offer_type, buyer, problem, delivery, public_status, price_range, updated_at";

const ARTIGO_PUBLICADO =
  "is_published = true and source_system = 'saraiva-owned'";

function ownedImageUrl(imageUrl: string | null) {
  return imageUrl?.startsWith("/images/news/") ? imageUrl : null;
}

function normalizeArticle(article: ArticleRow): Article {
  return {
    ...article,
    title: sanitizeLegacyBrandText(article.title),
    summary: sanitizeLegacyBrandText(article.summary),
    image_url: ownedImageUrl(article.image_url),
    source_name: "Saraiva.AI",
    story_content: null,
    content_text: article.content_text ?? "",
    url: "",
  };
}

function normalizeTool(tool: ToolWithRelations): CatalogTool {
  return { ...tool, tags: tool.tags ?? [] };
}


export async function getHomeData() {
  try {
    const [articles, reels] = await Promise.all([
      sql<ArticleRow>(
        `select id, slug, title, summary, image_url, author, source_name, source_system, published_at
           from editorial_articles
          where ${ARTIGO_PUBLICADO}
          order by published_at desc nulls last, display_order asc
          limit 6`,
      ),
      sql<InstagramVideo>(
        `select id, url, caption, thumbnail_url, video_url, username, duration, posted_at
           from editorial_reels
          where is_published = true and source_system = 'saraiva-instagram'
          order by posted_at desc nulls last, display_order asc
          limit 6`,
      ),
    ]);
    return { articles: articles.map((article) => normalizeArticle(article)), reels, available: true };
  } catch (error) {
    console.error("Falha ao carregar catálogo público", error instanceof Error ? error.message : "erro desconhecido");
    return { articles: [] as Article[], reels: [] as InstagramVideo[], available: false };
  }
}

export async function getToolBySlug(slug: string) {
  const rows = await sql<ToolWithRelations>(
    `select t.*,
            coalesce((
              select json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug) order by g.name)
                from editorial_tool_tags tt
                join editorial_tags g on g.id = tt.tag_id
               where tt.tool_id = t.id
            ), '[]'::json) as tags
       from editorial_tools t
      where t.is_published = true and t.slug = $1
      limit 1`,
    [slug],
  );
  return rows[0] ? normalizeTool(rows[0]) : null;
}

export async function getEditorialData() {
  try {
    const [articles, posts, videos, reels] = await Promise.all([
      sql<ArticleRow>(
        `select id, slug, title, summary, image_url, author, source_name, source_system, published_at
           from editorial_articles
          where ${ARTIGO_PUBLICADO}
          order by published_at desc nulls last, display_order asc`,
      ),
      Promise.resolve([] as Array<Pick<BlogPost, "id" | "slug" | "title" | "excerpt" | "published_at">>),
      sql<CatalogVideo>(
        `select * from editorial_videos
          where is_published = true and source_system = 'saraiva-video'
          order by published_at desc nulls last, display_order asc`,
      ),
      sql<InstagramVideo>(
        `select * from editorial_reels
          where is_published = true and source_system = 'saraiva-instagram'
          order by posted_at desc nulls last, display_order asc`,
      ),
    ]);
    return {
      articles: articles.map((article) => normalizeArticle({ ...article, story_content: null, content_text: "", url: "" })),
      posts: posts.map((post) => ({ ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), cover_image_url: null, content_html: "", tags: [] })),
      videos: videos.map((video) => ({ ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) })),
      reels: reels.map((reel) => ({ ...reel, caption: sanitizeLegacyBrandText(reel.caption), username: sanitizeLegacyBrandText(`@${reel.username}`).replace(/^@/, "") })),
    };
  } catch (error) {
    console.error("Falha ao carregar conteúdo de infraestrutura", error instanceof Error ? error.message : "erro desconhecido");
    return { articles: [], posts: [], videos: [], reels: [] };
  }
}

export async function getArticleBySlug(slug: string) {
  const isPreview = process.env.OWNED_ARTICLE_PREVIEW === "true" && slug === OWNED_ARTICLE_SLUG;
  let rows: ArticleRow[];
  try {
    rows = await sql<ArticleRow>(
      `select id, slug, title, summary, image_url, author, source_name, source_system, published_at, url, content_text
         from editorial_articles
        where ${ARTIGO_PUBLICADO} and slug = $1
        limit 1`,
      [slug],
    );
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
  const rows = await sql<Omit<BlogPost, "tags">>(
    `select * from editorial_posts where ${ARTIGO_PUBLICADO} and slug = $1 limit 1`,
    [slug],
  );
  const post = rows[0];
  return post ? { ...post, title: sanitizeLegacyBrandText(post.title), excerpt: sanitizeLegacyBrandText(post.excerpt), content_html: sanitizeLegacyBrandText(post.content_html), tags: [] } : null;
}

export async function getVideoBySlug(slug: string) {
  const rows = await sql<CatalogVideo>(
    `select * from editorial_videos
      where is_published = true and source_system = 'saraiva-video' and slug = $1
      limit 1`,
    [slug],
  );
  const video = rows[0];
  return video ? { ...video, title: sanitizeLegacyBrandText(video.title), description: sanitizeLegacyBrandText(video.description), story_content: sanitizeLegacyBrandText(video.story_content) } : null;
}

export async function getPublicOffers() {
  try {
    return await sql<PublicOffer>(
      `select ${COLUNAS_OFERTA} from editorial_offers
        where is_published = true
        order by updated_at desc`,
    );
  } catch (error) {
    console.error("Falha ao carregar soluções públicas", error instanceof Error ? error.message : "erro desconhecido");
    return [] as PublicOffer[];
  }
}

export async function getPublicOfferBySlug(slug: string) {
  const rows = await sql<PublicOffer>(
    `select ${COLUNAS_OFERTA} from editorial_offers
      where is_published = true and slug = $1
      limit 1`,
    [slug],
  );
  return rows[0] ?? null;
}
