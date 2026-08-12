import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage, VideoEmbed } from "@/components/saraiva/editorial/DetailPage";
import { MarkdownContent } from "@/components/saraiva/editorial/MarkdownContent";
import { getVideoBySlug } from "@/lib/catalog.server";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;
export async function generateMetadata({ params }: Props): Promise<Metadata> { const video = await getVideoBySlug((await params).slug).catch(() => null); if (!video) return {}; const description = (video.story_content || video.description).slice(0, 240); return { title: video.title, description, alternates: { canonical: `/video/${video.slug}` }, openGraph: { type: "video.other", title: video.title, description, images: [video.thumbnail_url] } }; }
export default async function VideoPage({ params }: Props) { const video = await getVideoBySlug((await params).slug).catch(() => null); if (!video) notFound(); return <DetailPage label="Vídeo" title={video.title} date={video.published_at}><VideoEmbed youtubeId={video.youtube_id} title={video.title} /><MarkdownContent content={video.story_content || video.description} /></DetailPage>; }
