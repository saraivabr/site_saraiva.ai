import type { Metadata } from "next";
import { TemplatesCatalog } from "@/components/saraiva/catalog/TemplatesCatalog";
import { getTemplates } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Templates", description: "Sistemas com inteligência artificial prontos para adaptar ao seu negócio.", alternates: { canonical: "/templates" } };
export const revalidate = 300;

export default async function TemplatesPage() {
  const templates = await getTemplates().catch(() => []);
  return <TemplatesCatalog templates={templates} />;
}
