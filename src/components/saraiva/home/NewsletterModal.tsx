"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, MailIcon } from "@/components/saraiva/shared/icons";
import { NewsletterForm } from "./NewsletterForm";

const OPEN_DELAY_MS = 8_000;

export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (sessionStorage.getItem("saraiva_newsletter_seen")) return;
    const timer = window.setTimeout(() => { setOpen(true); sessionStorage.setItem("saraiva_newsletter_seen", "1"); }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); };
  }, [open, close]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="newsletter-title" className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={(event) => { if (event.currentTarget === event.target) close(); }}>
      <div ref={dialogRef} className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0e14] p-7 text-white shadow-2xl sm:p-9">
        <button type="button" aria-label="Fechar newsletter" onClick={close} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"><CloseIcon className="size-5" /></button>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#0085FE]/15 text-[#66b7ff]"><MailIcon className="size-5" /></div>
        <h2 id="newsletter-title" className="mt-5 text-3xl font-semibold tracking-[-0.04em]">IA útil, direto na sua caixa de entrada.</h2>
        <p className="mt-3 mb-6 text-sm leading-6 text-white/50">A curadoria semanal da Saraiva.AI com ferramentas, notícias e aplicações que valem seu tempo.</p>
        <NewsletterForm idPrefix="modal" />
        <p className="mt-4 text-xs text-white/30">Sem spam. Você pode cancelar quando quiser.</p>
      </div>
    </div>
  );
}
