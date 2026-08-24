import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://saraiva.ai", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://saraiva.ai/diagnostico", lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: "https://saraiva.ai/content", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://saraiva.ai/news", lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: "https://saraiva.ai/about", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://saraiva.ai/privacidade", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: "https://saraiva.ai/termos", lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
