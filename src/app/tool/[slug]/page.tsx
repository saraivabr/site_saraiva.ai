import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolDetail } from "@/components/saraiva/catalog/ToolDetail";
import { getToolBySlug } from "@/lib/catalog.server";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getToolBySlug((await params).slug).catch(() => null);
  if (!tool) return { title: "Ferramenta não encontrada" };
  const description = (tool.short_description || tool.description).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
  return { title: tool.name, description, alternates: { canonical: `/tool/${tool.slug}` }, openGraph: { title: tool.name, description, url: `/tool/${tool.slug}`, type: "article", images: tool.screenshot_url ? [{ url: tool.screenshot_url, alt: tool.name }] : undefined } };
}

export default async function ToolPage({ params }: Props) {
  const tool = await getToolBySlug((await params).slug).catch(() => null);
  if (!tool) notFound();
  return <ToolDetail tool={tool} />;
}
