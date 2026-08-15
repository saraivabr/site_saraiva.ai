import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "ClaudeBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: "https://saraiva.ai/sitemap.xml",
    host: "https://saraiva.ai",
  };
}
