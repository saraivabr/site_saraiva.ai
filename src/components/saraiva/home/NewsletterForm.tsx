"use client";

import { useState } from "react";

export function NewsletterForm({ idPrefix = "newsletter" }: { idPrefix?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("loading");
    setMessage("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), source: idPrefix }) });
      const payload = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.message || "Não foi possível confirmar sua inscrição.");
      setStatus("success");
      setMessage(payload.message || "Inscrição confirmada.");
      formElement.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Tente novamente em instantes.");
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3" aria-busy={status === "loading"}>
      <label className="sr-only" htmlFor={`${idPrefix}-email`}>Seu melhor e-mail</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id={`${idPrefix}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="voce@empresa.com" className="h-12 min-w-0 flex-1 border border-white/20 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[var(--signal-sky)]" />
        <button disabled={status === "loading"} className="h-12 bg-[var(--signal-blue)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--signal-sky)] hover:text-[var(--signal-ink)] disabled:opacity-60" type="submit">{status === "loading" ? "Confirmando…" : "Quero receber"}</button>
      </div>
      {message ? <p role="status" className={`text-sm ${status === "error" ? "text-red-300" : "text-[#79e56b]"}`}>{message}</p> : null}
    </form>
  );
}
