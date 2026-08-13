import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const required = [
  "SUPABASE_CATALOG_URL",
  "SUPABASE_CATALOG_ANON_KEY",
  "SUPABASE_APP_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const name of required) {
  if (!process.env[name]) throw new Error(`Variável obrigatória ausente: ${name}`);
}

const sourceUrl = process.env.SUPABASE_CATALOG_URL.replace(/\/$/, "");
const sourceKey = process.env.SUPABASE_CATALOG_ANON_KEY;
const destinationUrl = process.env.SUPABASE_APP_URL.replace(/\/$/, "");
const destinationKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sourceSystem = "creative-ai-public";
const pageSize = 500;
const migratedAssetPrefix = `${destinationUrl}/storage/v1/object/public/editorial-public/`;

const sourceHeaders = {
  apikey: sourceKey,
  Authorization: `Bearer ${sourceKey}`,
};

const destinationHeaders = {
  apikey: destinationKey,
  Authorization: `Bearer ${destinationKey}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=minimal",
};

async function fetchAll(table, query = "") {
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const separator = query ? "&" : "?";
    const response = await fetch(
      `${sourceUrl}/rest/v1/${table}${query}${separator}limit=${pageSize}&offset=${offset}`,
      { headers: sourceHeaders },
    );
    if (!response.ok) throw new Error(`Falha ao ler ${table}: HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

async function fetchDestinationMedia(table, fields) {
  const response = await fetch(`${destinationUrl}/rest/v1/${table}?select=id,${fields.join(",")}`, { headers: destinationHeaders });
  if (!response.ok) throw new Error(`Falha ao conferir mídias de ${table}: HTTP ${response.status}`);
  return new Map((await response.json()).map((row) => [row.id, row]));
}

function preserveMigratedMedia(existing, field, sourceValue) {
  return existing?.[field]?.startsWith(migratedAssetPrefix) ? existing[field] : sourceValue;
}

async function upsert(table, rows, conflict = "id") {
  for (let index = 0; index < rows.length; index += 100) {
    const batch = rows.slice(index, index + 100);
    const response = await fetch(
      `${destinationUrl}/rest/v1/${table}?on_conflict=${encodeURIComponent(conflict)}`,
      { method: "POST", headers: destinationHeaders, body: JSON.stringify(batch) },
    );
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Falha ao gravar ${table}: HTTP ${response.status} ${detail.slice(0, 300)}`);
    }
  }
}

function cleanExternalUrl(value) {
  if (!value) return value;
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|referrer$|affiliate$|via$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function provenance(row) {
  return {
    source_system: sourceSystem,
    source_id: row.id,
    source_created_at: row.created_at ?? null,
    source_updated_at: row.updated_at ?? null,
  };
}

const [tools, tags, toolTags, articles, posts] = await Promise.all([
  fetchAll("tools", "?select=*&is_published=eq.true&order=created_at.asc"),
  fetchAll("tags", "?select=*&order=created_at.asc"),
  fetchAll("tool_tags", "?select=tool_id,tag_id"),
  fetchAll("articles", "?select=*&is_published=eq.true&order=created_at.asc"),
  fetchAll("blog_posts", "?select=*&is_published=eq.true&order=created_at.asc"),
]);
// Vídeos não são importados da base de referência. A superfície audiovisual é
// exclusiva de canais próprios da Saraiva.AI.
const videos = [];
const reels = [];
// Templates são produtos e não podem herdar nome, imagem ou oferta de outra
// marca. Só entram por uma esteira própria da Saraiva.AI.
const templates = [];

const publishedToolIds = new Set(tools.map(({ id }) => id));
const relatedToolTags = toolTags.filter(({ tool_id }) => publishedToolIds.has(tool_id));
const [existingTools, existingPosts, existingVideos, existingReels, existingTemplates] = await Promise.all([
  fetchDestinationMedia("editorial_tools", ["screenshot_url", "video_url"]),
  fetchDestinationMedia("editorial_posts", ["cover_image_url"]),
  fetchDestinationMedia("editorial_videos", ["thumbnail_url", "video_url"]),
  fetchDestinationMedia("editorial_reels", ["thumbnail_url", "video_url"]),
  fetchDestinationMedia("editorial_templates", ["image_url"]),
]);

await upsert("editorial_tags", tags.map((row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  source_system: sourceSystem,
  source_id: row.id,
  source_created_at: row.created_at ?? null,
})));

await upsert("editorial_tools", tools.map((row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description ?? "",
  short_description: row.short_description ?? "",
  url: cleanExternalUrl(row.url),
  screenshot_url: preserveMigratedMedia(existingTools.get(row.id), "screenshot_url", row.screenshot_url),
  video_url: preserveMigratedMedia(existingTools.get(row.id), "video_url", row.video_url),
  pricing_type: row.pricing_type,
  additional_context: row.additional_context,
  headquarters: row.headquarters,
  country_code: row.country_code,
  user_reviews: row.user_reviews,
  is_featured: Boolean(row.is_featured),
  is_published: true,
  ...provenance(row),
})));

await upsert("editorial_tool_tags", relatedToolTags.map((row) => ({
  tool_id: row.tool_id,
  tag_id: row.tag_id,
  source_system: sourceSystem,
})), "tool_id,tag_id");

await upsert("editorial_articles", articles.map((row) => ({
  id: row.id,
  slug: row.slug,
  url: cleanExternalUrl(row.url),
  title: row.title,
  summary: row.summary ?? "",
  image_url: row.image_url,
  author: row.author,
  source_name: row.source_name,
  source_domain: row.source_domain,
  published_at: row.published_at,
  display_order: row.display_order ?? 0,
  content_html: row.content_html,
  content_text: row.content_text ?? "",
  word_count: row.word_count,
  reading_time_minutes: row.reading_time_minutes,
  story_content: row.story_content,
  story_generated_at: row.story_generated_at,
  is_published: false,
  ...provenance(row),
})));

await upsert("editorial_posts", posts.map((row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt ?? "",
  content_html: row.content_html ?? "",
  cover_image_url: preserveMigratedMedia(existingPosts.get(row.id), "cover_image_url", row.cover_image_url),
  language: row.language,
  published_at: row.published_at,
  is_published: false,
  ...provenance(row),
})));

await upsert("editorial_videos", videos.map((row) => ({
  id: row.id,
  slug: row.slug,
  youtube_id: row.youtube_id,
  title: row.title,
  description: row.description ?? "",
  thumbnail_url: preserveMigratedMedia(existingVideos.get(row.id), "thumbnail_url", row.thumbnail_url),
  video_url: preserveMigratedMedia(existingVideos.get(row.id), "video_url", row.video_url),
  views: row.views,
  duration: row.duration,
  published_at: row.published_at,
  display_order: row.display_order ?? 0,
  summary: row.summary,
  story_content: row.story_content,
  story_generated_at: row.story_generated_at,
  transcript: row.transcript,
  is_published: true,
  ...provenance(row),
})));

await upsert("editorial_reels", reels.map((row) => ({
  id: row.id,
  shortcode: row.shortcode,
  url: cleanExternalUrl(row.url),
  caption: row.caption ?? "",
  thumbnail_url: preserveMigratedMedia(existingReels.get(row.id), "thumbnail_url", row.thumbnail_url),
  video_url: preserveMigratedMedia(existingReels.get(row.id), "video_url", row.video_url),
  username: row.username,
  likes: row.likes,
  comments: row.comments,
  views: row.views,
  duration: row.duration,
  posted_at: row.posted_at,
  display_order: row.display_order ?? 0,
  is_published: true,
  ...provenance(row),
})));

await upsert("editorial_templates", templates.map((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  category: row.category,
  tech_stack: row.tech_stack ?? [],
  features: row.features ?? [],
  use_cases: row.use_cases ?? [],
  external_integrations: row.external_integrations ?? [],
  lovable_url: cleanExternalUrl(row.lovable_url),
  image_url: preserveMigratedMedia(existingTemplates.get(row.id), "image_url", row.image_url),
  price_cents: row.price_cents,
  display_order: row.display_order ?? 0,
  is_published: true,
  ...provenance(row),
})));

const manifest = {
  generated_at: new Date().toISOString(),
  source_system: sourceSystem,
  destination_project: "saraiva-ai-production",
  privacy_scope: "Somente tabelas e registros públicos publicados; perfis, sessões, e-mails e dados de alunos excluídos.",
  counts: {
    editorial_tools: tools.length,
    editorial_tags: tags.length,
    editorial_tool_tags: relatedToolTags.length,
    editorial_articles: articles.length,
    editorial_posts: posts.length,
    editorial_videos: videos.length,
    editorial_reels: reels.length,
    editorial_templates: templates.length,
  },
};

const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
manifest.sha256 = createHash("sha256").update(manifestJson).digest("hex");
const outputPath = resolve(process.argv[2] ?? ".saraivaos/proof/supabase-public-catalog-migration.json");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ output: outputPath, ...manifest }, null, 2)}\n`);
