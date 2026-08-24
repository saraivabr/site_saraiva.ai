import { HomeExperience } from "@/components/saraiva/home/HomeExperience";
import { getHomeData, getPublicOffers } from "@/lib/catalog.server";

export const revalidate = 300;

export default async function Home() {
  const [{ articles, reels }, offers] = await Promise.all([getHomeData(), getPublicOffers()]);
  const cards = offers.map(({ slug, name, problem, offer_type, price_range, public_status }) => ({
    slug,
    name,
    problem,
    offer_type,
    price_range,
    public_status,
  }));
  return <HomeExperience offers={cards} articles={articles} reels={reels} />;
}
