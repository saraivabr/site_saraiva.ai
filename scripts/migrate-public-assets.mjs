import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const appUrl = process.env.SUPABASE_APP_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const oldHost = "cdzgysmojjlztadeyhao.supabase.co";
const bucket = "editorial-public";
const concurrency = Number(process.env.ASSET_MIGRATION_CONCURRENCY ?? 8);

if (!appUrl || !serviceKey) throw new Error("Defina SUPABASE_APP_URL e SUPABASE_SERVICE_ROLE_KEY.");

const auth = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
const specs = [
  { table: "editorial_tools", fields: ["screenshot_url", "video_url"] },
  { table: "editorial_posts", fields: ["cover_image_url"] },
  { table: "editorial_videos", fields: ["thumbnail_url", "video_url"] },
  { table: "editorial_reels", fields: ["thumbnail_url", "video_url"] },
  { table: "editorial_templates", fields: ["image_url"] },
];

async function ensureBucket() {
  const response = await fetch(`${appUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...auth, "content-type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  });
  if (!response.ok && response.status !== 400) throw new Error(`Bucket indisponível (${response.status})`);
}

async function rowsFor(spec) {
  const response = await fetch(`${appUrl}/rest/v1/${spec.table}?select=id,${spec.fields.join(",")}`, {
    headers: { ...auth, Range: "0-1999" },
  });
  if (!response.ok) throw new Error(`${spec.table}: leitura falhou (${response.status})`);
  return response.json();
}

function storagePath(sourceUrl) {
  const parsed = new URL(sourceUrl);
  const marker = "/storage/v1/object/public/";
  const original = decodeURIComponent(parsed.pathname.slice(parsed.pathname.indexOf(marker) + marker.length));
  return `imported/${original}`.split("/").map(encodeURIComponent).join("/");
}

async function copyAsset(sourceUrl) {
  let source;
  for (let attempt = 0; attempt < 5; attempt++) {
    source = await fetch(sourceUrl);
    if (source.ok) break;
    if (source.status !== 429 || attempt === 4) throw new Error(`download ${source.status}`);
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500 * (attempt + 1)));
  }
  const bytes = new Uint8Array(await source.arrayBuffer());
  const path = storagePath(sourceUrl);
  const upload = await fetch(`${appUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { ...auth, "content-type": source.headers.get("content-type") || "application/octet-stream", "x-upsert": "true" },
    body: bytes,
  });
  if (!upload.ok) throw new Error(`upload ${upload.status}`);
  return { url: `${appUrl}/storage/v1/object/public/${bucket}/${path}`, bytes: bytes.byteLength };
}

async function patchRow(table, id, fields) {
  const response = await fetch(`${appUrl}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...auth, "content-type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(fields),
  });
  if (!response.ok) throw new Error(`${table}/${id}: atualização falhou (${response.status})`);
}

async function pool(items, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  }));
}

await ensureBucket();
const groups = await Promise.all(specs.map(async (spec) => ({ spec, rows: await rowsFor(spec) })));
const sourceUrls = [...new Set(groups.flatMap(({ spec, rows }) => rows.flatMap((row) => spec.fields.map((field) => row[field])).filter((value) => typeof value === "string" && value.includes(oldHost))))];
const copied = new Map();
const failures = [];
let totalBytes = 0;

await pool(sourceUrls, async (sourceUrl, index) => {
  try {
    const result = await copyAsset(sourceUrl);
    copied.set(sourceUrl, result.url);
    totalBytes += result.bytes;
  } catch (error) {
    failures.push({ source: sourceUrl, error: error instanceof Error ? error.message : "erro desconhecido" });
  }
  if ((index + 1) % 100 === 0 || index + 1 === sourceUrls.length) console.log(`assets ${index + 1}/${sourceUrls.length}`);
});

let updatedRows = 0;
for (const { spec, rows } of groups) {
  await pool(rows, async (row) => {
    const update = {};
    for (const field of spec.fields) if (copied.has(row[field])) update[field] = copied.get(row[field]);
    if (Object.keys(update).length) {
      await patchRow(spec.table, row.id, update);
      updatedRows++;
    }
  });
}

const summary = {
  generated_at: new Date().toISOString(),
  destination_bucket: bucket,
  source_objects: sourceUrls.length,
  copied_objects: copied.size,
  copied_bytes: totalBytes,
  updated_rows: updatedRows,
  failures,
};
summary.sha256 = createHash("sha256").update(JSON.stringify(summary)).digest("hex");
const output = resolve(".saraivaos/proof/supabase-public-assets-migration.json");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ output, ...summary, failures: failures.length }, null, 2));
