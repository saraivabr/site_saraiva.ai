import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/saraiva/editorial/DetailPage";
import { MarkdownContent } from "@/components/saraiva/editorial/MarkdownContent";
import { getArticleBySlug } from "@/lib/catalog.server";
import { sourceLabel } from "@/components/saraiva/editorial/format";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;
export async function generateMetadata({ params }: Props): Promise<Metadata> { const article = await getArticleBySlug((await params).slug).catch(() => null); return article ? { title: article.title, description: article.summary, alternates: { canonical: `/news/${article.slug}` }, openGraph: { type: "article", title: article.title, description: article.summary, publishedTime: article.published_at ?? undefined, authors: article.author ? [article.author] : undefined, images: [article.image_url || "/news/saraiva-truth-v1.webp"] } } : {}; }
export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug((await params).slug).catch(() => null);
  if (!article) notFound();
  const isOwned = article.source_system === "saraiva-owned";
  const whatsappUrl = "https://wa.me/5511988642668?text=Quero%20o%20diagn%C3%B3stico%20do%20fluxo%20de%20resposta";
  return <DetailPage label={sourceLabel(article.source_name)} title={article.title} author={article.author} date={article.published_at} image={article.image_url} brandedNewsArt externalUrl={article.url || undefined} externalLabel="Ler publicação original" cta={isOwned ? { href: whatsappUrl, label: "Pedir diagnóstico no WhatsApp", description: "Em vinte minutos, mapeamos onde uma resposta fica esperando e qual dado falta para medir o primeiro atendimento. É gratuito e não obriga você a contratar nada." } : undefined}><MarkdownContent content={article.content_text || article.summary} /></DetailPage>;
}
