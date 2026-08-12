import { HomeExperience } from "@/components/saraiva/home/HomeExperience";
import { getHomeData } from "@/lib/catalog.server";

export const revalidate = 300;

export default async function Home() {
  const { tools, tags, articles, videos, available } = await getHomeData();
  return <HomeExperience tools={tools} tags={tags} articles={articles} videos={videos} catalogAvailable={available} />;
}
