"use client";

import { ArrowRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Client component: tudo que entra aqui é serializado no HTML da página.
// Só os campos exibidos viajam — buyer e delivery ficam no servidor.
export type OfferCardData = Pick<
  PublicOffer,
  "slug" | "name" | "problem" | "offer_type" | "price_range" | "public_status"
>;

import type { PublicOffer } from "@/components/saraiva/catalog/data";

const INITIAL_COUNT = 12;
const PAGE_SIZE = 12;
const ALL = "todos";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function OfferCard({ offer, index }: { offer: OfferCardData; index: number }) {
  return (
    <Link
      href={`/solution/${offer.slug}`}
      className="group flex min-h-[15rem] flex-col border border-[var(--signal-border)] bg-white p-6 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-1 hover:border-[var(--signal-ink)] hover:bg-[var(--signal-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-blue)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--signal-muted)]">
          {String(index + 1).padStart(2, "0")} · {offer.public_status}
        </span>
        <ArrowRight
          className="size-4 shrink-0 text-[var(--signal-muted)] transition-[translate,color] duration-150 group-hover:translate-x-1 group-hover:text-[var(--signal-ink)]"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-6 text-2xl font-semibold leading-[1.05] tracking-[-0.04em]">{offer.name}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--signal-muted)]">{offer.problem}</p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[.12em] text-[var(--signal-muted)]">
          {offer.offer_type}
        </span>
        <span className="text-sm font-semibold tracking-[-0.02em] decoration-[var(--color-lime)] decoration-4 underline-offset-4 group-hover:underline">
          {offer.price_range}
        </span>
      </div>
    </Link>
  );
}

export function OfferExplorer({ offers }: { offers: OfferCardData[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const types = useMemo(() => {
    const seen = new Map<string, number>();
    offers.forEach((offer) => seen.set(offer.offer_type, (seen.get(offer.offer_type) ?? 0) + 1));
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [offers]);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return offers.filter((offer) => {
      if (activeType !== ALL && offer.offer_type !== activeType) return false;
      if (!term) return true;
      return normalize(`${offer.name} ${offer.problem} ${offer.offer_type}`).includes(term);
    });
  }, [offers, query, activeType]);

  const visible = filtered.slice(0, visibleCount);

  function reset(next: () => void) {
    next();
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <section
      id="explorar"
      className="border-y border-[var(--signal-border)] bg-white py-16 md:py-24"
      aria-labelledby="explorar-title"
    >
      <div className="signal-shell">
        <div className="grid min-w-0 items-end gap-8 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <div className="min-w-0">
            <p className="signal-kicker">02 · Construir</p>
            <h2 id="explorar-title" className="signal-section-title">O que dá para construir.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--signal-muted)]">
              Soluções que nasceram do nosso radar e estão abertas para validação com quem vive o problema.
            </p>
          </div>

          <div className="min-w-0">
            <label htmlFor="offer-search" className="sr-only">Buscar solução</label>
            <div className="flex min-h-16 items-center border-b-2 border-[var(--signal-ink)] focus-within:border-[var(--signal-blue)]">
              <Search className="mr-4 size-5" aria-hidden="true" />
              <input
                id="offer-search"
                type="search"
                value={query}
                onChange={(event) => reset(() => setQuery(event.target.value))}
                placeholder="Ex.: perder lead, ata de reunião, deploy..."
                className="min-w-0 flex-1 bg-transparent text-xl tracking-[-0.025em] outline-none placeholder:text-black/30 md:text-2xl"
              />
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" aria-label="Filtrar por tipo de oferta">
              {[ALL, ...types].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => reset(() => setActiveType(type))}
                  aria-pressed={activeType === type}
                  className={`shrink-0 border px-4 py-2 font-mono text-[10px] uppercase tracking-[.12em] transition-colors ${
                    activeType === type
                      ? "border-[var(--signal-ink)] bg-[var(--signal-ink)] text-white"
                      : "border-[var(--signal-border)] text-[var(--signal-muted)] hover:border-[var(--signal-ink)] hover:text-[var(--signal-ink)]"
                  }`}
                >
                  {type === ALL ? `Todas · ${offers.length}` : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div id="lista-completa" className="mt-12 scroll-mt-24" aria-live="polite" aria-atomic="true">
          {visible.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((offer, index) => (
                <OfferCard key={offer.slug} offer={offer} index={index} />
              ))}
            </div>
          ) : (
            <div className="border-t border-[var(--signal-border)] py-14 text-center">
              <Sparkles className="mx-auto size-5 text-[var(--signal-blue)]" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">Nada com essa combinação.</h3>
              <p className="mt-1 text-sm text-[var(--signal-muted)]">
                Limpe o filtro ou descreva o problema com outras palavras.
              </p>
            </div>
          )}
        </div>

        {visibleCount < filtered.length ? (
          <button
            type="button"
            onClick={() => setVisibleCount((value) => Math.min(value + PAGE_SIZE, filtered.length))}
            className="mt-8 inline-flex min-h-12 items-center gap-3 border border-[var(--signal-ink)] px-6 text-sm font-semibold transition-colors hover:bg-[var(--signal-ink)] hover:text-white"
          >
            Ver mais {filtered.length - visibleCount} <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </section>
  );
}
