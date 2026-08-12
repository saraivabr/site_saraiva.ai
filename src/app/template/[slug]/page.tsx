import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateDetail } from "@/components/saraiva/catalog/TemplateDetail";
import { getTemplateBySlug } from "@/lib/catalog.server";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = await getTemplateBySlug((await params).slug).catch(() => null);
  if (!template) return { title: "Template não encontrado" };
  const description = template.tagline || template.description || template.name;
  return { title: template.name, description, alternates: { canonical: `/template/${template.slug}` }, openGraph: { title: template.name, description, url: `/template/${template.slug}`, images: template.image_url ? [{ url: template.image_url, alt: template.name }] : undefined } };
}

export default async function TemplatePage({ params }: Props) {
  const template = await getTemplateBySlug((await params).slug).catch(() => null);
  if (!template) notFound();
  return <TemplateDetail template={template} />;
}
