import type { Metadata } from "next";
import { EditorialCard } from "@/components/saraiva/editorial/EditorialCard";
import { EditorialHero, EditorialShell } from "@/components/saraiva/editorial/EditorialShell";
import { buildEditorialItems } from "@/components/saraiva/editorial/data";
import { getEditorialData } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Notícias de IA", description: "Notícias e análises sobre inteligência artificial, tecnologia e negócios.", alternates: { canonical: "/news" } };
export const revalidate = 300;

export default async function NewsPage() {
  const { articles, posts } = await getEditorialData();
  return <EditorialShell><main><EditorialHero title="Notícias de IA" description="Leituras selecionadas para separar sinal de barulho." /><div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-2 sm:px-8 md:py-16 lg:grid-cols-3">{buildEditorialItems(articles, posts).map((item) => <EditorialCard key={item.id} item={item} />)}</div></main></EditorialShell>;
}
