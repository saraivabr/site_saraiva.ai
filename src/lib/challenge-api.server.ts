import "server-only";

import { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const MAX_TRACKED_CLIENTS = 5_000;
const requests = new Map<string, number[]>();

export function enforceChallengeRateLimit(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  if (requests.size >= MAX_TRACKED_CLIENTS && !requests.has(ip)) {
    for (const [client, timestamps] of requests) {
      if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) requests.delete(client);
    }
    if (requests.size >= MAX_TRACKED_CLIENTS) return false;
  }
  const recent = (requests.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return false;
  recent.push(now);
  requests.set(ip, recent);
  return true;
}

export function cleanText(value: unknown, maxLength = 6_000) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, maxLength);
}
