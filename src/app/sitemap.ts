import type { MetadataRoute } from "next";

const BASE = "https://saraiva.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
