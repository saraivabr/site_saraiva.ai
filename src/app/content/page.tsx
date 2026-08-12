import type { Metadata } from "next";
import { ContentHub } from "@/components/saraiva/editorial/ContentHub";
import { EditorialHero, EditorialShell } from "@/components/saraiva/editorial/EditorialShell";
import { buildEditorialItems } from "@/components/saraiva/editorial/data";
import { getEditorialData } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Conteúdos", description: "Artigos, vídeos e cortes sobre inteligência artificial, ferramentas e operação.", alternates: { canonical: "/content" } };
export const revalidate = 300;

export default async function ContentPage() {
  const { articles, posts, videos, reels } = await getEditorialData();
  return <EditorialShell><main><EditorialHero title="Conteúdos" description="Artigos, vídeos longos e cortes curtos para entender e aplicar inteligência artificial." /><ContentHub articles={buildEditorialItems(articles, posts)} videoItems={videos.map((video) => ({ id: video.id, slug: video.slug, title: video.title, thumbnailUrl: video.thumbnail_url, duration: video.duration, publishedAt: video.published_at }))} reelItems={reels.map((video) => ({ id: video.id, url: video.url, caption: video.caption, thumbnailUrl: video.thumbnail_url, videoUrl: video.video_url, username: video.username, duration: video.duration, postedAt: video.posted_at }))} /></main></EditorialShell>;
}
