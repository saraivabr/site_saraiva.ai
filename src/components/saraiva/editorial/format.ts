export type EditorialCardItem = {
  id: string;
  href: string;
  title: string;
  summary: string;
  image: string | null;
  label: string;
  publishedAt: string | null;
};

export function formatDate(value: string | null, long = false) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function sourceLabel(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes("substack")) return "SUBSTACK";
  if (normalized.includes("exame")) return "EXAME";
  return source.toUpperCase();
}
