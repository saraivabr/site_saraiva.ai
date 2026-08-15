"use client";

import { ArrowRight, CheckCircle2, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import type { Article, CatalogTag, CatalogTool, InstagramVideo } from "@/components/saraiva/catalog/data";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SiteIntro } from "./SiteIntro";

const INITIAL_COUNT = 8;

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLocaleLowerCase("pt-BR");
}

const problems = [
  { title: "Leads entram. O acompanhamento some.", text: "A empresa investe para gerar oportunidades, mas perde dinheiro entre a primeira mensagem, a proposta e o follow-up." },
  { title: "A operação depende de quem lembra.", text: "Informações, decisões e processos ficam presos em pessoas específicas, conversas e planilhas desconectadas." },
  { title: "Existe tecnologia. Falta operação.", text: "Ferramentas foram contratadas, mas os dados não circulam e o trabalho continua manual, lento e difícil de medir." },
];

const method = [
  { n: "01", title: "Identificar", text: "Lemos a jornada real, não o processo idealizado." },
  { n: "02", title: "Interpretar", text: "Localizamos a fricção, o desejo real e o impacto econômico." },
  { n: "03", title: "Implementar", text: "Desenhamos e construímos o menor sistema capaz de gerar resultado." },
  { n: "04", title: "Provar", text: "Medimos, documentamos e transformamos resultado em capacidade operacional." },
];

const systems = [
  { name: "empresa.ia.br", text: "IA aplicada às áreas e processos de uma empresa." },
  { name: "escreve.ai", text: "Memória operacional e inteligência sobre conversas autorizadas do WhatsApp." },
  { name: "ligacao.ai", text: "Voz para atendimento, relacionamento, qualificação e follow-up." },
  { name: "musicacom.ia.br", text: "Criação, produção e monetização musical apoiadas por IA." },
];

export function HomeExperience({ tools, tags, articles, reels, catalogAvailable }: { tools: CatalogTool[]; tags: CatalogTag[]; articles: Article[]; reels: InstagramVideo[]; catalogAvailable: boolean }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filteredTools = useMemo(() => {
    const value = normalize(deferredQuery);
    if (!value) return tools.slice(0, INITIAL_COUNT);
    return tools.filter((tool) => normalize([tool.name, tool.short_description, ...tool.tags.map((tag) => tag.name)].join(" ")).includes(value)).slice(0, 12);
  }, [tools, deferredQuery]);

  return (
    <div className="signal-site min-h-screen bg-[var(--signal-paper)] text-[var(--signal-ink)]">
      <SiteIntro />
      <SiteHeader />
      <main>
        <section className="border-b border-[var(--signal-border)]">
          <div className="signal-shell grid min-h-[82vh] items-center gap-12 py-16 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="signal-kicker">Saraiva.AI · Diagnóstico e implementação</p>
              <h1 className="mt-7 max-w-5xl text-[clamp(3.5rem,7.6vw,8rem)] font-semibold leading-[.84] tracking-[-.075em]">Gargalos viram operações que funcionam.</h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--signal-muted)]">Identificamos onde sua empresa perde vendas, tempo e controle — e implementamos sistemas, integrações, automações e agentes para mudar o resultado.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/diagnostico" className="inline-flex min-h-14 items-center justify-center gap-3 bg-[var(--signal-blue)] px-6 font-semibold text-white hover:bg-[var(--signal-ink)]">Mapear meu gargalo <ArrowRight className="size-4" /></Link>
                <a href="#sistemas" className="inline-flex min-h-14 items-center justify-center border border-[var(--signal-ink)] px-6 font-semibold hover:bg-white">Ver sistemas em operação</a>
              </div>
            </div>
            <aside className="border-l border-[var(--signal-border)] pl-7 lg:pl-10">
              <p className="font-mono text-xs uppercase tracking-[.12em] text-[var(--signal-muted)]">O cliente não quer IA</p>
              <div className="mt-5 space-y-0 divide-y divide-[var(--signal-border)] border-y border-[var(--signal-border)]">
                {["Vender mais", "Responder melhor", "Perder menos clientes", "Controlar a operação", "Reduzir trabalho manual"].map((item) => <div key={item} className="flex items-center gap-3 py-4 text-lg font-semibold"><CheckCircle2 className="size-4 text-[var(--signal-blue)]" />{item}</div>)}
              </div>
            </aside>
          </div>
        </section>

        <section id="solucoes" className="signal-shell py-20 md:py-28">
          <p className="signal-kicker">01 · O problema real</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><h2 className="signal-section-title">Sua empresa não precisa de mais uma ferramenta.</h2><p className="max-w-xl self-end text-lg leading-8 text-[var(--signal-muted)]">Precisa parar de perder resultado nas transições entre pessoas, canais, sistemas e decisões.</p></div>
          <div className="mt-14 grid gap-px bg-[var(--signal-border)] md:grid-cols-3">{problems.map((problem, index) => <article key={problem.title} className="bg-[var(--signal-paper)] p-7 md:p-9"><span className="font-mono text-xs text-[var(--signal-blue)]">0{index + 1}</span><h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-.04em]">{problem.title}</h3><p className="mt-4 text-sm leading-6 text-[var(--signal-muted)]">{problem.text}</p></article>)}</div>
        </section>

        <section id="metodo" className="border-y border-[var(--signal-border)] bg-white py-20 md:py-28">
          <div className="signal-shell">
            <p className="signal-kicker">02 · Método</p>
            <h2 className="signal-section-title">Tecnologia entra depois da interpretação.</h2>
            <div className="mt-14 grid gap-px bg-[var(--signal-border)] md:grid-cols-2 lg:grid-cols-4">{method.map((item) => <article key={item.n} className="min-h-64 bg-white p-7"><span className="font-mono text-xs text-[var(--signal-blue)]">{item.n}</span><h3 className="mt-14 text-3xl font-semibold tracking-[-.05em]">{item.title}</h3><p className="mt-4 text-sm leading-6 text-[var(--signal-muted)]">{item.text}</p></article>)}</div>
            <Link href="/diagnostico" className="mt-10 inline-flex min-h-14 items-center gap-3 bg-[var(--signal-ink)] px-6 font-semibold text-white hover:bg-[var(--signal-blue)]">Começar pelo diagnóstico <ArrowRight className="size-4" /></Link>
          </div>
        </section>

        <section id="sistemas" className="signal-shell py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="signal-kicker">03 · Prova de capacidade</p><h2 className="signal-section-title">Sistemas em operação.</h2></div><div className="grid gap-px bg-[var(--signal-border)] sm:grid-cols-2">{systems.map((system) => <article key={system.name} className="bg-[var(--signal-paper)] p-7"><h3 className="text-2xl font-semibold tracking-[-.045em]">{system.name}</h3><p className="mt-4 text-sm leading-6 text-[var(--signal-muted)]">{system.text}</p></article>)}</div></div>
        </section>

        <section id="base" className="border-y border-[var(--signal-border)] bg-white py-20 md:py-28">
          <div className="signal-shell">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="signal-kicker">04 · Repertório aplicado</p><h2 className="signal-section-title">A base continua. Agora no lugar certo.</h2><p className="mt-5 max-w-md text-sm leading-6 text-[var(--signal-muted)]">{tools.length} ferramentas e {tags.length} territórios organizados para pesquisa e decisão — não para substituir o diagnóstico do problema.</p></div><div className="self-end"><label htmlFor="tool-search" className="sr-only">Buscar ferramentas</label><div className="flex min-h-16 items-center border-b-2 border-[var(--signal-ink)]"><Search className="mr-4 size-5" /><input id="tool-search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-xl outline-none placeholder:text-black/30" type="search" placeholder="Qual trabalho você precisa fazer?" /></div></div></div>
            {!catalogAvailable ? <div className="mt-12 border border-[var(--signal-border)] p-8">A base está se reconectando.</div> : <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{filteredTools.map((tool) => <Link key={tool.id} href={`/tool/${tool.slug}`} className="group border border-[var(--signal-border)] bg-white p-5 hover:border-[var(--signal-blue)]"><div className="relative mb-5 aspect-[16/10] overflow-hidden bg-[var(--signal-soft)]">{tool.screenshot_url ? <Image src={tool.screenshot_url} alt={`Tela da ferramenta ${tool.name}`} fill unoptimized className="object-cover object-top transition group-hover:scale-[1.03]" /> : <div className="absolute inset-0 grid place-items-center"><Sparkles className="size-5 text-[var(--signal-blue)]" /></div>}</div><h3 className="text-xl font-semibold tracking-[-.04em] group-hover:text-[var(--signal-blue)]">{tool.name}</h3><p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--signal-muted)]">{tool.short_description}</p></Link>)}</div>}
          </div>
        </section>

        {articles.length ? <section className="signal-shell py-20 md:py-28"><div className="flex items-end justify-between gap-6"><div><p className="signal-kicker">05 · Conteúdo · {articles.length} análises · {reels.length} reels</p><h2 className="signal-section-title">Interpretação antes da novidade.</h2></div><Link href="/news" className="signal-text-link">Ver conteúdo <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-px bg-[var(--signal-border)] md:grid-cols-3">{articles.slice(0, 3).map((article) => <Link key={article.id} href={`/news/${article.slug}`} className="bg-[var(--signal-paper)] p-7 hover:bg-white"><p className="signal-kicker">Análise</p><h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-.04em]">{article.title}</h3><p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--signal-muted)]">{article.summary}</p></Link>)}</div></section> : null}

        <section className="border-t border-[var(--signal-border)] bg-[var(--signal-blue)] text-white">
          <div className="signal-shell grid gap-10 py-20 md:grid-cols-[1fr_auto] md:items-end md:py-28"><div><p className="font-mono text-xs uppercase tracking-[.14em] text-white/70">Próxima decisão</p><h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[.9] tracking-[-.06em] md:text-8xl">Descubra onde sua operação está parando.</h2></div><Link href="/diagnostico" className="inline-flex min-h-14 items-center gap-3 bg-white px-6 font-semibold text-[var(--signal-ink)] hover:bg-[var(--signal-ink)] hover:text-white">Fazer diagnóstico <ArrowRight className="size-4" /></Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
