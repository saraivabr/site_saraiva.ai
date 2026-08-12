"use client";

import { useMemo, useState } from "react";
import type { CatalogTool } from "@/components/saraiva/catalog/data";
import { ToolCard } from "./ToolCard";

const INITIAL_TOOL_COUNT = 30;
const TOOL_PAGE_SIZE = 30;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLocaleLowerCase("pt-BR");
}

export function ToolGridSection({ tools, query, activeTag, catalogAvailable }: { tools: CatalogTool[]; query: string; activeTag: string | null; catalogAvailable: boolean }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_TOOL_COUNT);
  const normalizedQuery = normalize(query);
  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesTag = !activeTag || tool.tags.some((tag) => tag.slug === activeTag);
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;
    return normalize([tool.name, tool.short_description, tool.description.replace(/<[^>]+>/g, " "), ...tool.tags.map((tag) => tag.name)].join(" ")).includes(normalizedQuery);
  }), [tools, activeTag, normalizedQuery]);
  const visibleTools = filteredTools.slice(0, visibleCount);

  return (
    <section className="bg-[#f6f4ee] py-16" id="catalogo">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0085FE]">Catálogo vivo</p>
            <h2 className="mt-2 text-3xl font-semibold uppercase tracking-[-0.04em] text-[#0a0b0f] md:text-4xl">Ferramentas selecionadas</h2>
          </div>
          <p className="text-sm text-black/45">{filteredTools.length} {filteredTools.length === 1 ? "resultado" : "resultados"}</p>
        </div>
        {!catalogAvailable ? (
          <div role="status" className="rounded-3xl border border-[#0085FE]/20 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold">O catálogo está se reconectando.</h3>
            <p className="mt-2 text-sm text-black/55">Nenhum dado privado foi usado como fallback. Tente novamente em instantes.</p>
          </div>
        ) : visibleTools.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTools.map((tool) => <ToolCard key={tool.id} tool={{ id: tool.id, href: `/tool/${tool.slug}`, name: tool.name, description: tool.short_description || tool.description.replace(/<[^>]+>/g, " ").slice(0, 220), tags: tool.tags.map((tag) => `#${tag.slug}`), imageSrc: tool.screenshot_url, imageAlt: `Captura de tela de ${tool.name}` }} />)}
          </div>
        ) : (
          <p className="rounded-3xl bg-white py-12 text-center text-sm text-black/55">Nenhuma ferramenta encontrada para estes filtros.</p>
        )}
        {visibleCount < filteredTools.length ? <div className="mt-14 flex justify-center"><button className="rounded-full bg-[#0a0b0f] px-8 py-3 text-sm font-semibold text-white hover:bg-[#0085FE]" onClick={() => setVisibleCount((count) => Math.min(count + TOOL_PAGE_SIZE, filteredTools.length))} type="button">Carregar mais</button></div> : null}
      </div>
    </section>
  );
}
