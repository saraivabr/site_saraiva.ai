"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { CatalogTool } from "@/components/saraiva/catalog/data";

const FEATURED_NAMES = ["Google Flow", "Luvvoice", "Obsidian", "Dola AI"];
const STICKY_TOP = 80;
const STICKY_STEP = 14;

function selectFeatured(tools: CatalogTool[]) {
  const chosen: CatalogTool[] = [];
  for (const name of FEATURED_NAMES) {
    const tool = tools.find((item) => item.name.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"));
    if (tool?.screenshot_url && !chosen.some((item) => item.id === tool.id)) chosen.push(tool);
  }
  for (const tool of tools) {
    if (chosen.length >= 4) break;
    if (tool.screenshot_url && !chosen.some((item) => item.id === tool.id)) chosen.push(tool);
  }
  return chosen.slice(0, 4);
}

export function StackingToolCards({ tools }: { tools: CatalogTool[] }) {
  const featured = useMemo(() => selectFeatured(tools), [tools]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [depth, setDepth] = useState(() => featured.map(() => 0));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setDepth(featured.map((_, index) => {
        let count = 0;
        for (let next = index + 1; next < featured.length; next += 1) {
          const element = cardRefs.current[next];
          if (element && element.getBoundingClientRect().top <= STICKY_TOP + next * STICKY_STEP + 2) count += 1;
        }
        return count;
      }));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [featured]);

  if (featured.length < 2) return null;

  return (
    <section className="mt-20 md:mt-28" aria-labelledby="stack-title">
      <div className="mb-8 grid gap-4 md:grid-cols-[.72fr_1.28fr]">
        <p className="signal-kicker">Navegação em camadas</p>
        <div>
          <h3 id="stack-title" className="max-w-3xl text-[clamp(2.4rem,5vw,5.3rem)] font-semibold leading-[.9] tracking-[-0.065em]">Algumas portas para entrar na base.</h3>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--signal-muted)]">Continue rolando: cada ferramenta sobe e deixa a próxima assumir o foco.</p>
        </div>
      </div>
      <div className="relative" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
        {featured.map((tool, index) => {
          const currentDepth = depth[index] ?? 0;
          return (
            <div key={tool.id} ref={(element) => { cardRefs.current[index] = element; }} className="sticky mb-4" style={{ top: STICKY_TOP + index * STICKY_STEP, zIndex: 10 + index }}>
              <div style={{ transform: `scale(${1 - currentDepth * 0.035}) translateY(${currentDepth * 7}px)`, transformOrigin: "top center", transition: "transform 300ms cubic-bezier(.16,1,.3,1)" }}>
                <Link href={`/tool/${tool.slug}`} className="group grid min-h-[340px] overflow-hidden border border-[var(--signal-border)] bg-[var(--signal-paper)] shadow-[0_18px_70px_rgba(17,19,21,.08)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-blue)] md:grid-cols-[.85fr_1.15fr]">
                  <div className="flex flex-col p-6 md:p-9">
                    <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--signal-muted)]"><span>{String(index + 1).padStart(2, "0")} · {tool.tags[0]?.name || "Ferramenta"}</span><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                    <h4 className="mt-14 max-w-xl text-4xl font-semibold leading-[.95] tracking-[-0.055em] md:text-6xl">{tool.name}</h4>
                    <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--signal-muted)]">{tool.short_description || tool.description.replace(/<[^>]+>/g, " ").slice(0, 220)}</p>
                    <span className="mt-auto pt-8 text-sm font-semibold text-[var(--signal-blue)]">Conhecer ferramenta</span>
                  </div>
                  <div className="relative min-h-[260px] overflow-hidden bg-[var(--signal-ink)] md:min-h-[420px]">
                    <Image src={tool.screenshot_url!} alt={`Tela de ${tool.name}`} fill unoptimized sizes="(max-width: 768px) 100vw, 60vw" className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
