"use client";

import type { CatalogTag } from "@/components/saraiva/catalog/data";

const copies = [0, 1, 2] as const;

export function TagMarqueeSection({ tags, activeTag, onTagChange }: { tags: CatalogTag[]; activeTag: string | null; onTagChange(tag: string | null): void }) {
  const rows = Array.from({ length: 4 }, (_, row) => tags.filter((_, index) => index % 4 === row));
  if (!tags.length) return null;
  return (
    <section className="overflow-hidden border-b border-white/10 bg-[#07090d] pb-8">
      <div className="saraiva-container pb-4 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">A IA está em todos os lugares</h2>
        <p className="mt-1 text-sm text-white/35">Explore por mercado, profissão ou forma de criar</p>
      </div>
      <div className="relative overflow-hidden py-4">
        <div className="flex flex-col gap-2">
          {rows.map((row, rowIndex) => (
            <div className="flex h-12 items-center" key={rowIndex}>
              <div className="saraiva-marquee-track motion-reduce:animate-none" style={{ animationDirection: rowIndex % 2 ? "reverse" : "normal", animationDuration: `${42 + rowIndex * 8}s` }}>
                {copies.flatMap((copy) => row.map((tag) => {
                  const active = activeTag === tag.slug;
                  return <button key={`${copy}-${tag.id}`} type="button" aria-pressed={active} onClick={() => onTagChange(active ? null : tag.slug)} className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${active ? "bg-[#0085FE]/20 text-[#66b7ff]" : "bg-white/[0.06] text-white/45 hover:bg-white/10 hover:text-white/70"}`}>#{tag.name}</button>;
                }))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
