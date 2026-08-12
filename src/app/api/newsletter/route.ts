import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Envie um e-mail válido." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = typeof body.source === "string" ? body.source.slice(0, 80) : "site";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, message: "Confira o endereço de e-mail." }, { status: 422 });
  }
  const url = process.env.SUPABASE_APP_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Newsletter indisponível: configuração ausente");
    return NextResponse.json({ ok: false, message: "Inscrição temporariamente indisponível." }, { status: 503 });
  }
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/newsletter_subscribers?on_conflict=email`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json", Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ email, source, status: "active", updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) {
    console.error("Newsletter falhou", response.status);
    return NextResponse.json({ ok: false, message: "Não foi possível confirmar agora. Tente novamente." }, { status: 502 });
  }
  const inserted = await response.json() as Array<{ email?: string }>;
  if (inserted.length === 0) {
    return NextResponse.json({ ok: true, duplicate: true, message: "Esse e-mail já recebe os sinais da Saraiva.AI." });
  }
  return NextResponse.json({ ok: true, duplicate: false, message: "Inscrição confirmada. Bem-vindo à curadoria Saraiva.AI!" }, { status: 201 });
}
