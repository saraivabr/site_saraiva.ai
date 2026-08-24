import type { MetadataRoute } from "next";

import { getPublicOffers } from "@/lib/catalog.server";

const BASE = "https://saraiva.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const offers = await getPublicOffers();

  const fixas: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/diagnostico`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/content`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const solucoes: MetadataRoute.Sitemap = offers.map((offer) => ({
    url: `${BASE}/solution/${offer.slug}`,
    lastModified: offer.updated_at ? new Date(offer.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...fixas, ...solucoes];
}
