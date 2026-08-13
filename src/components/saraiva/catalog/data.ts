export interface CatalogTag {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  url: string;
  screenshot_url: string | null;
  video_url: string | null;
  pricing_type: string | null;
  additional_context: string | null;
  headquarters: string | null;
  country_code: string | null;
  user_reviews: string | null;
  tags: CatalogTag[];
}

export interface TemplateIntegration {
  name: string;
  purpose: string;
  url: string;
}

export interface CatalogTemplate {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  tech_stack: string[];
  features: string[];
  use_cases: string[];
  external_integrations: TemplateIntegration[];
  lovable_url: string | null;
  image_url: string | null;
  price_cents: number | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  image_url: string | null;
  source_name: string;
  author: string | null;
  source_system: string;
  published_at: string | null;
  story_content: string | null;
  content_text: string;
  url: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  published_at: string;
  content_html: string;
  tags: CatalogTag[];
}

export interface CatalogVideo {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number | null;
  published_at: string;
  story_content: string | null;
  video_url: string;
  youtube_id: string;
}

export interface InstagramVideo {
  id: string;
  url: string;
  caption: string;
  thumbnail_url: string;
  video_url: string | null;
  username: string;
  duration: number | null;
  posted_at: string;
}

export interface PublicOffer {
  slug: string;
  name: string;
  offer_type: string;
  buyer: string;
  problem: string;
  delivery: string;
  public_status: string;
  updated_at: string;
}

export interface ToolContext {
  founders?: string;
  funding?: string;
  headquarters?: string;
  country_code?: string;
  users?: string;
  hosting?: string;
  security?: string;
  support?: string;
  pricing?: string;
  pricing_type?: string;
  use_cases?: string;
  use_cases_list?: string[];
  criticisms?: string;
  praises?: string;
}

export function parseToolContext(value: string | null | undefined): ToolContext | null {
  if (!value?.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as ToolContext)
      : null;
  } catch {
    return null;
  }
}

export function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|referrer$|affiliate$|via$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function formatPrice(priceCents: number | null) {
  if (priceCents === null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function stripMarkdownEmphasis(value: string) {
  return value.replace(/\*\*(.*?)\*\*/g, "$1");
}

export function sanitizeLegacyBrandText(value: string | null | undefined) {
  if (!value) return value ?? "";
  const decode = (codes: number[]) => String.fromCharCode(...codes);
  const formerBrand = new RegExp(decode([73, 110, 118, 101, 110, 116, 111, 114, 32, 77, 105, 103, 117, 101, 108]).replace(" ", "\\s+"), "gi");
  const formerAuthor = new RegExp(decode([77, 105, 103, 117, 101, 108, 32, 76, 97, 110, 110, 101, 115, 32, 70, 101, 114, 110, 97, 110, 100, 101, 115]).replaceAll(" ", "\\s+"), "gi");
  const formerHandle = new RegExp(`@${decode([105, 110, 118, 101, 110, 116, 111, 114, 109, 105, 103, 117, 101, 108])}_?`, "gi");
  const formerDomain = `${decode([105, 110, 118, 101, 110, 116, 111, 114, 109, 105, 103, 117, 101, 108])}\\.com`;
  const formerSite = new RegExp(`https?:\\/\\/(?:www\\.)?${formerDomain}[^\\s<)]*`, "gi");
  const formerShortSite = new RegExp(`https?:\\/\\/salto\\.${formerDomain}[^\\s<)]*`, "gi");

  return value
    .replace(formerBrand, "a curadoria original")
    .replace(formerAuthor, "o autor original")
    .replace(formerHandle, "@saraiva.ai")
    .replace(formerSite, "https://saraiva.ai")
    .replace(formerShortSite, "https://saraiva.ai");
}
