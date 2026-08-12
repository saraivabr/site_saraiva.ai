import type { Metadata } from "next";
import { EditorialHero, EditorialShell } from "@/components/saraiva/editorial/EditorialShell";
import { NewsFeed } from "@/components/saraiva/editorial/NewsFeed";
import { buildEditorialItems } from "@/components/saraiva/editorial/data";
import { getEditorialData } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Notícias de IA", description: "Notícias e análises sobre inteligência artificial, tecnologia e negócios.", alternates: { canonical: "/news" } };
export const revalidate = 300;

export default async function NewsPage() {
  const { articles, posts } = await getEditorialData();
  return <EditorialShell><main><EditorialHero eyebrow="01 · Radar" title="O que mudou enquanto você trabalhava." description="Notícias e análises com contexto suficiente para decidir — e personalidade suficiente para serem lembradas." /><NewsFeed items={buildEditorialItems(articles, posts)} /></main></EditorialShell>;
}
