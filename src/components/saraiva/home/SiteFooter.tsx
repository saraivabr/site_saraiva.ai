import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/15 bg-[var(--signal-ink)] text-white">
      <section id="newsletter" className="signal-shell grid gap-10 py-16 md:grid-cols-[.8fr_1.2fr] md:py-24">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--signal-sky)]">Sinal privado</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[.95] tracking-[-0.055em] md:text-6xl">Uma leitura útil. Sem encher sua caixa.</h2>
        </div>
        <div className="self-end">
          <p className="mb-6 max-w-lg text-sm leading-6 text-white/55">Problemas, aplicações e movimentos de IA traduzidos em decisões práticas para a operação.</p>
          <NewsletterForm idPrefix="footer" />
        </div>
      </section>
      <div className="signal-shell flex flex-col gap-6 border-t border-white/15 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-semibold tracking-[-0.04em] text-white">saraiva<span className="text-[var(--signal-sky)]">.ai</span></span>
        <nav className="flex flex-wrap gap-5">
          <Link href="/diagnostico">Diagnóstico</Link>
          <Link href="/content">Conteúdo</Link>
          <Link href="/about">Sobre</Link>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/termos">Termos</Link>
          <a href="https://wa.me/5511988642668" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </nav>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
