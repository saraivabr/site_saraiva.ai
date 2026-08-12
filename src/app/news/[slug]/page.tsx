import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/saraiva/editorial/DetailPage";
import { MarkdownContent } from "@/components/saraiva/editorial/MarkdownContent";
import { getArticleBySlug } from "@/lib/catalog.server";
import { sourceLabel } from "@/components/saraiva/editorial/format";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;
export async function generateMetadata({ params }: Props): Promise<Metadata> { const article = await getArticleBySlug((await params).slug).catch(() => null); return article ? { title: article.title, description: article.summary, alternates: { canonical: `/news/${article.slug}` }, openGraph: { type: "article", title: article.title, description: article.summary, publishedTime: article.published_at ?? undefined, images: ["/news/saraiva-truth-v1.webp"] } } : {}; }
export default async function ArticlePage({ params }: Props) { const article = await getArticleBySlug((await params).slug).catch(() => null); if (!article) notFound(); return <DetailPage label={sourceLabel(article.source_name)} title={article.title} date={article.published_at} image={article.image_url} brandedNewsArt externalUrl={article.url} externalLabel="Ler publicação original"><MarkdownContent content={article.story_content || article.content_text || article.summary} /></DetailPage>; }
