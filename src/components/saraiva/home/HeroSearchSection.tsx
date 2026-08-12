"use client";

import { SearchIcon } from "@/components/saraiva/shared/icons";

export function HeroSearchSection({ query, onQueryChange }: { query: string; onQueryChange(value: string): void }) {
  return (
    <section className="relative overflow-hidden bg-[#07090d]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,133,254,0.24),transparent_42%)]" />
      <div className="saraiva-container relative flex flex-col items-center py-24 md:py-32 lg:py-36">
        <p className="mb-6 rounded-full border border-[#0085FE]/35 bg-[#0085FE]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#66b7ff]">
          Inteligência aplicada, sem ruído
        </p>
        <h1 className="text-center text-[46px] font-semibold uppercase leading-[0.98] tracking-[-0.05em] text-[#f7f5ef] md:text-[72px] lg:text-[94px]">
          A melhor curadoria
          <br />
          <span className="text-[#0085FE]">para usar IA de verdade</span>
        </h1>
        <p className="mt-7 max-w-2xl text-center text-base leading-7 text-white/55 md:text-lg">
          Ferramentas, conteúdos e sistemas prontos para transformar conhecimento em operação.
        </p>
        <div aria-label="Busca de ferramentas de IA" className="mt-10 flex h-14 w-full max-w-2xl items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-6 transition-colors hover:bg-white/10 focus-within:border-[#0085FE]/70" role="search">
          <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-white/50" />
          <input
            aria-label="Pesquisar ferramentas de IA"
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Pesquisar no catálogo Saraiva.AI"
            type="search"
            value={query}
          />
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#newsletter" className="rounded-full bg-[#0085FE] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]">Assinar a newsletter</a>
          <a href="https://wa.me/5511988642668?text=Ol%C3%A1%2C%20vim%20pelo%20novo%20site%20Saraiva.AI." target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-[#79e56b] hover:text-[#79e56b]">Falar no WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
