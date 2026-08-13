"use client";

import { ArrowRight, CirclePlay, Command, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import type { Article, CatalogTag, CatalogTool, InstagramVideo } from "@/components/saraiva/catalog/data";
import { NewsArt } from "@/components/saraiva/editorial/NewsArt";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SiteIntro } from "./SiteIntro";
import { StackingToolCards } from "./StackingToolCards";
import { ToolGraph } from "./ToolGraph";

const INITIAL_COUNT = 12;
const PAGE_SIZE = 12;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLocaleLowerCase("pt-BR");
}

function ToolResult({ tool, index }: { tool: CatalogTool; index: number }) {
  return (
    <Link href={`/tool/${tool.slug}`} className="group grid min-h-40 overflow-hidden border border-[var(--signal-border)] bg-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-1 hover:border-[var(--signal-ink)] hover:bg-[var(--signal-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-blue)] sm:grid-cols-[170px_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--signal-soft)] sm:aspect-auto">
        {tool.screenshot_url ? <Image src={tool.screenshot_url} alt={`Tela de ${tool.name}`} fill unoptimized sizes="(max-width: 640px) 100vw, 170px" className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.035]" /> : <div className="absolute inset-0 grid place-items-center"><Sparkles className="size-6 text-[var(--signal-blue)]" /></div>}
        <span className="absolute left-3 top-3 bg-[var(--signal-ink)] px-2 py-1 font-mono text-[9px] tabular-nums text-white">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex min-w-0 flex-col p-5">
        <h3 className="text-xl font-semibold tracking-[-0.035em] text-[var(--signal-ink)] transition-colors group-hover:text-[var(--signal-blue)]">{tool.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--signal-muted)]">{tool.short_description || tool.description.replace(/<[^>]+>/g, " ").slice(0, 180)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="flex min-w-0 flex-wrap gap-1.5">{tool.tags.slice(0, 2).map((tag) => <span key={tag.id} className="border border-[var(--signal-border)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--signal-muted)]">{tag.name}</span>)}</div>
          <ArrowRight className="size-4 shrink-0 text-[var(--signal-muted)] transition-[translate,color] duration-150 group-hover:translate-x-1 group-hover:text-[var(--signal-blue)]" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

export function HomeExperience({ tools, tags, articles, reels, catalogAvailable }: { tools: CatalogTool[]; tags: CatalogTag[]; articles: Article[]; reels: InstagramVideo[]; catalogAvailable: boolean }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);

  const filteredTools = useMemo(() => tools.filter((tool) => {
    if (activeTag && !tool.tags.some((tag) => tag.slug === activeTag)) return false;
    if (!normalizedQuery) return true;
    return normalize([tool.name, tool.short_description, ...tool.tags.map((tag) => tag.name)].join(" ")).includes(normalizedQuery);
  }), [tools, activeTag, normalizedQuery]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const featuredArticle = articles[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        setQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="signal-site min-h-screen bg-[var(--signal-paper)] text-[var(--signal-ink)]">
      <SiteIntro />
      <SiteHeader />
      <main>
        <section className="border-b border-[var(--signal-border)]">
          <div className="signal-shell grid min-h-[76vh] items-end gap-10 py-12 md:grid-cols-[1.15fr_.85fr] md:py-20">
            <div className="self-center">
              <p className="signal-kicker">Saraiva.AI · Inteligência em operação</p>
              <h1 className="mt-7 max-w-4xl text-[clamp(3.5rem,8vw,8.4rem)] font-semibold leading-[0.82] tracking-[-0.075em]">Sinal para quem precisa decidir.</h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-[var(--signal-muted)] md:text-lg">Notícias, ferramentas e sistemas organizados para transformar inteligência artificial em repertório, trabalho e resultado.</p>
              <a href="#explorar" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[var(--signal-blue)] px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--signal-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-blue)]">Explorar a base <ArrowRight className="size-4" /></a>
            </div>
            <div className="border-l border-[var(--signal-border)] pl-6 md:pl-10">
              <div className="flex items-center justify-between border-b border-[var(--signal-border)] pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--signal-muted)]"><span>Base própria</span><span className="text-[var(--signal-blue)]">Atualizada</span></div>
              <dl className="divide-y divide-[var(--signal-border)]">
                {[{value: tools.length,label:"ferramentas"},{value: articles.length,label:"sinais recentes"},{value: reels.length,label:"reels Saraiva.AI"},{value: tags.length,label:"territórios"}].map((item) => <div key={item.label} className="flex items-end justify-between py-5"><dt className="text-sm text-[var(--signal-muted)]">{item.label}</dt><dd className="font-mono text-3xl tracking-[-0.05em]">{item.value}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        {featuredArticle ? <section className="signal-shell py-16 md:py-24" aria-labelledby="agora-title">
          <div className="mb-8 flex items-end justify-between gap-6"><div><p className="signal-kicker">01 · Agora</p><h2 id="agora-title" className="signal-section-title">O que merece atenção.</h2></div><Link href="/news" className="signal-text-link">Todas as notícias <ArrowRight className="size-4" /></Link></div>
          <div className="grid gap-px bg-[var(--signal-border)] lg:grid-cols-[1.6fr_.8fr]">
            <Link href={`/news/${featuredArticle.slug}`} className="group bg-[var(--signal-paper)]">
              <NewsArt title={featuredArticle.title} image={featuredArticle.image_url} priority />
              <div className="grid gap-4 p-6 md:grid-cols-[1fr_180px] md:p-8"><h3 className="text-3xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-5xl">{featuredArticle.title}</h3><p className="text-sm leading-6 text-[var(--signal-muted)]">{featuredArticle.summary}</p></div>
            </Link>
            <div className="bg-[var(--signal-paper)]">
              {articles.slice(1, 5).map((article, index) => <Link key={article.id} href={`/news/${article.slug}`} className="group grid grid-cols-[28px_1fr] gap-4 border-b border-[var(--signal-border)] p-5 last:border-0 hover:bg-[var(--signal-soft)]"><span className="font-mono text-[10px] text-[var(--signal-blue)]">0{index + 2}</span><div><h3 className="font-semibold leading-snug tracking-[-0.025em] group-hover:text-[var(--signal-blue)]">{article.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--signal-muted)]">{article.summary}</p></div></Link>)}
            </div>
          </div>
        </section> : null}

        <section id="explorar" className="border-y border-[var(--signal-border)] bg-white py-16 md:py-24" aria-labelledby="explorar-title">
          <div className="signal-shell">
            <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,.65fr)_minmax(0,1.35fr)]">
              <div className="min-w-0"><p className="signal-kicker">02 · Aplicar</p><h2 id="explorar-title" className="signal-section-title">Encontre pelo trabalho que precisa fazer.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-[var(--signal-muted)]">Busque por nome, tarefa ou território. O resultado responde enquanto você digita.</p></div>
              <div className="min-w-0">
                <label htmlFor="signal-search" className="sr-only">Buscar ferramentas</label>
                <div className="flex min-h-16 items-center border-b-2 border-[var(--signal-ink)] focus-within:border-[var(--signal-blue)]"><Search className="mr-4 size-5" aria-hidden="true" /><input ref={searchInputRef} id="signal-search" value={query} onChange={(event) => {setQuery(event.target.value);setVisibleCount(INITIAL_COUNT);}} className="min-w-0 flex-1 bg-transparent text-xl tracking-[-0.025em] outline-none placeholder:text-black/30 md:text-2xl" type="search" placeholder="Ex.: criar vídeo, vender, pesquisar..." /><span className="hidden items-center gap-1 border border-[var(--signal-border)] px-2 py-1 font-mono text-[10px] text-[var(--signal-muted)] sm:flex"><Command className="size-3" /> K</span></div>
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" aria-label="Filtrar por território">{tags.slice(0, 12).map((tag) => <button key={tag.id} type="button" aria-pressed={activeTag === tag.slug} onClick={() => {setActiveTag((current) => current === tag.slug ? null : tag.slug);setVisibleCount(INITIAL_COUNT);}} className={`shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-150 ${activeTag === tag.slug ? "border-[var(--signal-blue)] bg-[var(--signal-blue)] text-white" : "border-[var(--signal-border)] text-[var(--signal-muted)] hover:border-[var(--signal-ink)] hover:text-[var(--signal-ink)]"}`}>{tag.name}</button>)}</div>
              </div>
            </div>
            {catalogAvailable && filteredTools.length ? <ToolGraph tools={filteredTools} onSelectTag={(tagSlug) => { setActiveTag(tagSlug); setVisibleCount(INITIAL_COUNT); }} /> : null}
            <div id="lista-completa" className="mt-12 scroll-mt-24" aria-live="polite" aria-atomic="true"><div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--signal-border)] pb-4"><div><p className="signal-kicker">Lista completa</p><h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Todas as ferramentas, com tela e contexto.</h3></div><div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--signal-muted)]"><span>{filteredTools.length} resultados</span><span className="ml-6">{activeTag ? `Filtro: ${activeTag}` : "Todos os territórios"}</span></div></div>
              {!catalogAvailable ? <div role="alert" className="border border-[var(--signal-border)] p-8"><h3 className="font-semibold">A base está se reconectando.</h3><p className="mt-2 text-sm text-[var(--signal-muted)]">Nenhum dado privado é usado como fallback. Tente novamente em instantes.</p></div> : visibleTools.length ? <div className="grid gap-4 lg:grid-cols-2">{visibleTools.map((tool,index) => <ToolResult key={tool.id} tool={tool} index={index} />)}</div> : <div className="border-t border-[var(--signal-border)] py-14 text-center"><Sparkles className="mx-auto size-5 text-[var(--signal-blue)]" /><h3 className="mt-4 font-semibold">Nada com essa combinação.</h3><p className="mt-1 text-sm text-[var(--signal-muted)]">Limpe o filtro ou tente descrever a tarefa com outras palavras.</p></div>}
            </div>
            {visibleCount < filteredTools.length ? <button type="button" onClick={() => setVisibleCount((value) => Math.min(value + PAGE_SIZE, filteredTools.length))} className="mt-8 min-h-12 w-full border border-[var(--signal-ink)] text-sm font-semibold transition-colors hover:bg-[var(--signal-ink)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-blue)]">Mostrar mais {Math.min(PAGE_SIZE, filteredTools.length - visibleCount)}</button> : null}
            {catalogAvailable ? <StackingToolCards tools={tools} /> : null}
          </div>
        </section>

        {reels.length ? <section className="signal-shell py-16 md:py-24" aria-labelledby="aprofundar-title"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="signal-kicker">03 · Aprofundar</p><h2 id="aprofundar-title" className="signal-section-title">Direto do Instagram.</h2></div><Link href="/content#instagram" className="signal-text-link">Ver todos <ArrowRight className="size-4" /></Link></div><div className="grid gap-px bg-[var(--signal-border)] md:grid-cols-3">{reels.slice(0,3).map((reel) => <a key={reel.id} href={reel.url} target="_blank" rel="noreferrer" className="group bg-[var(--signal-paper)]"><div className="relative aspect-[9/12] overflow-hidden bg-[var(--signal-ink)]"><Image src={reel.thumbnail_url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover transition-[filter,scale] duration-300 group-hover:scale-[1.02]" /><span className="absolute inset-0 grid place-items-center"><span className="grid size-12 place-items-center bg-[var(--signal-blue)] text-white"><CirclePlay className="size-5" /></span></span></div><div className="p-5"><p className="signal-kicker">@saraiva.ai</p><h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.035em]">{reel.caption}</h3></div></a>)}</div></section> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
