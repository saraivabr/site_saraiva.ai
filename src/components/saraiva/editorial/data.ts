import type { Article, BlogPost } from "@/components/saraiva/catalog/data";
import type { EditorialCardItem } from "./format";

export function buildEditorialItems(articles: Article[], posts: BlogPost[]): EditorialCardItem[] {
  return [
    ...articles.map((article) => ({ id: article.id, href: `/news/${article.slug}`, title: article.title, summary: article.summary, image: article.image_url, label: article.source_name || "Artigo", publishedAt: article.published_at })),
    ...posts.map((post) => ({ id: post.id, href: `/blog/${post.slug}`, title: post.title, summary: post.excerpt, image: null, label: "Blog", publishedAt: post.published_at })),
  ].sort((a, b) => Date.parse(b.publishedAt ?? "") - Date.parse(a.publishedAt ?? ""));
}
