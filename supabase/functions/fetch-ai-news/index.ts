import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RSS_FEEDS = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch AI",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    source: "The Verge AI",
  },
];

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

function extractTag(xml: string, tag: string): string {
  const openTag = `<${tag}`;
  const closeTag = `</${tag}>`;
  const start = xml.indexOf(openTag);
  if (start === -1) return "";
  const contentStart = xml.indexOf(">", start) + 1;
  const end = xml.indexOf(closeTag, contentStart);
  if (end === -1) return "";
  let content = xml.slice(contentStart, end).trim();
  // Strip CDATA
  if (content.startsWith("<![CDATA[")) {
    content = content.slice(9, content.indexOf("]]>"));
  }
  return content;
}

function parseRSS(xml: string, source: string): FeedItem[] {
  const items: FeedItem[] = [];
  let pos = 0;

  while (true) {
    const itemStart = xml.indexOf("<item>", pos);
    if (itemStart === -1) break;
    const itemEnd = xml.indexOf("</item>", itemStart);
    if (itemEnd === -1) break;

    const itemXml = xml.slice(itemStart, itemEnd + 7);
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");

    let description = extractTag(itemXml, "description");
    // Strip HTML tags from description
    description = description.replace(/<[^>]*>/g, "").trim();
    if (description.length > 500) {
      description = description.slice(0, 497) + "...";
    }

    if (title && link) {
      items.push({ title, description, link, pubDate, source });
    }

    pos = itemEnd + 7;
  }

  return items;
}

type ContentCategory = "tool" | "analysis" | "thought";

function categorize(title: string, description: string): ContentCategory {
  const text = `${title} ${description}`.toLowerCase();

  const toolKeywords = [
    "launch", "release", "tool", "app", "platform", "startup",
    "feature", "update", "api", "model", "product",
  ];
  const analysisKeywords = [
    "report", "study", "research", "data", "trend", "market",
    "growth", "analysis", "statistics", "benchmark",
  ];

  const toolScore = toolKeywords.filter((k) => text.includes(k)).length;
  const analysisScore = analysisKeywords.filter((k) => text.includes(k)).length;

  if (analysisScore > toolScore) return "analysis";
  if (toolScore > 0) return "tool";
  return "thought";
}

function detectPricing(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("free") && (text.includes("paid") || text.includes("premium") || text.includes("pro"))) {
    return "Freemium";
  }
  if (text.includes("open source") || text.includes("open-source") || text.match(/\bfree\b/)) {
    return "Free";
  }
  if (text.includes("pricing") || text.includes("subscription") || text.includes("enterprise")) {
    return "Paid";
  }
  return null;
}

function generateTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];

  const tagMap: Record<string, string[]> = {
    "chatgpt": ["chatgpt", "openai"],
    "openai": ["openai"],
    "claude": ["claude", "anthropic"],
    "anthropic": ["anthropic"],
    "google": ["google"],
    "gemini": ["gemini", "google"],
    "meta": ["meta"],
    "llama": ["llama", "meta"],
    "midjourney": ["midjourney"],
    "stable diffusion": ["stable-diffusion"],
    "copilot": ["copilot"],
    "automation": ["automação"],
    "coding": ["código"],
    "design": ["design"],
    "marketing": ["marketing"],
  };

  for (const [keyword, keywordTags] of Object.entries(tagMap)) {
    if (text.includes(keyword)) {
      for (const t of keywordTags) {
        if (!tags.includes(t)) tags.push(t);
      }
    }
  }

  return tags.slice(0, 5);
}

Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let totalInserted = 0;

    for (const feed of RSS_FEEDS) {
      try {
        const response = await fetch(feed.url, {
          headers: { "User-Agent": "SARAIVA.AI RSS Bot/1.0" },
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${feed.source}: ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = parseRSS(xml, feed.source);

        for (const item of items.slice(0, 10)) {
          // Check for duplicates by source_url
          const { data: existing } = await supabase
            .from("contents")
            .select("id")
            .eq("source_url", item.link)
            .maybeSingle();

          if (existing) continue;

          const category = categorize(item.title, item.description);
          const pricing = category === "tool" ? detectPricing(item.title, item.description) : null;
          const tags = generateTags(item.title, item.description);

          const { error } = await supabase.from("contents").insert({
            title: item.title,
            description: item.description,
            category,
            tags,
            pricing,
            featured: false,
            published: false, // Draft for review
            source: feed.source,
            source_url: item.link,
            auto_generated: true,
          });

          if (error) {
            console.error(`Insert error for "${item.title}":`, error.message);
          } else {
            totalInserted++;
          }
        }
      } catch (err) {
        console.error(`Error processing feed ${feed.source}:`, err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: totalInserted }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
