import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { PublicOffer } from "@/components/saraiva/catalog/data";

export function OfferShowcase({ offers, compact = false }: { offers: PublicOffer[]; compact?: boolean }) {
  if (!offers.length) return null;

  return (
    <section className="border-y border-[var(--signal-border)] bg-[var(--signal-ink)] text-white">
      <div className="signal-shell py-14 md:py-20">
        <div className="grid gap-8 border-b border-white/20 pb-10 md:grid-cols-[180px_1fr]">
          <p className="signal-kicker pt-1 text-[var(--signal-sky)]">03 · Construir</p>
          <div>
            <h2 className="max-w-4xl text-[clamp(2.6rem,5.8vw,6rem)] font-semibold leading-[.88] tracking-[-0.065em]">
              Do sinal ao que podemos construir.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
              Soluções nascidas do nosso radar, agora abertas para validação com empresas que vivem esses problemas.
            </p>
          </div>
        </div>

        <div className={`grid border-l border-white/20 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
          {offers.map((offer, index) => (
            <Link
              key={offer.slug}
              href={`/solution/${offer.slug}`}
              className="group relative flex min-h-[330px] flex-col border-b border-r border-white/20 p-6 transition-colors hover:bg-[var(--signal-blue)] md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--signal-sky)] group-hover:text-white/70">
                  {String(index + 1).padStart(2, "0")} · {offer.public_status}
                </span>
                <ArrowUpRight className="size-5 text-white/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <h3 className="mt-10 text-3xl font-semibold leading-[.95] tracking-[-0.05em]">{offer.name}</h3>
              <p className="mt-5 line-clamp-4 text-sm leading-6 text-white/60 group-hover:text-white/80">{offer.problem}</p>
              <span className="mt-auto pt-8 font-mono text-[10px] uppercase tracking-[.12em] text-white/45 group-hover:text-white/70">{offer.offer_type}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
