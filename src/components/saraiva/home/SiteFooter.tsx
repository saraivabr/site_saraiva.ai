import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="bg-[#07090d] text-white">
      <section id="newsletter" className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66b7ff]">Curadoria Saraiva.AI</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Menos ruído. Mais direção.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Receba ferramentas, notícias e usos práticos de IA selecionados para quem precisa colocar a tecnologia para trabalhar.</p></div>
          <div><NewsletterForm idPrefix="footer" /><a href="https://wa.me/5511988642668?text=Ol%C3%A1%2C%20vim%20pelo%20novo%20site%20Saraiva.AI." target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-[#79e56b]">Prefere conversar? Fale no WhatsApp ↗</a></div>
        </div>
      </section>
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-5 px-6 py-9 sm:flex-row md:px-8">
        <Image src="/brand/saraiva-ai-logo.png" alt="Saraiva.AI" width={160} height={48} className="h-8 w-auto brightness-0 invert" />
        <nav className="flex flex-wrap justify-center gap-5 text-xs text-white/45"><Link href="/content">Conteúdo</Link><Link href="/templates">Templates</Link><Link href="/about">Sobre</Link><a href="https://wa.me/5511988642668" target="_blank" rel="noopener noreferrer">WhatsApp</a></nav>
        <p className="text-xs text-white/35">© 2026 Saraiva.AI</p>
      </div>
    </footer>
  );
}
