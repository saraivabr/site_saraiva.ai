import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/saraiva/editorial/DetailPage";
import { SafeHtml } from "@/components/saraiva/catalog/SafeHtml";
import { getPostBySlug } from "@/lib/catalog.server";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;
export async function generateMetadata({ params }: Props): Promise<Metadata> { const post = await getPostBySlug((await params).slug).catch(() => null); return post ? { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.published_at, images: post.cover_image_url ? [post.cover_image_url] : undefined } } : {}; }
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug).catch(() => null);
  if (!post) notFound();

  return (
    <DetailPage label="POST" title={post.title} date={post.published_at} image={post.cover_image_url} backLabel="Voltar">
      <SafeHtml className="prose-saraiva" html={post.content_html} />
    </DetailPage>
  );
}
