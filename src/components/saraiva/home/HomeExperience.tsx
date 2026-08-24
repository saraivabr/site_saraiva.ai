"use client";

import { ArrowRight, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Article, InstagramVideo } from "@/components/saraiva/catalog/data";
import { NewsArt } from "@/components/saraiva/editorial/NewsArt";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SiteIntro } from "./SiteIntro";
import { OfferExplorer, type OfferCardData } from "./OfferExplorer";


export function HomeExperience({ offers, articles, reels }: { offers: OfferCardData[]; articles: Article[]; reels: InstagramVideo[] }) {
  const featuredArticle = articles[0];
  const offerTypes = new Set(offers.map((offer) => offer.offer_type)).size;


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
              <p className="mt-8 max-w-xl text-base leading-7 text-[var(--signal-muted)] md:text-lg">Notícias, soluções e sistemas organizados para transformar inteligência artificial em repertório, trabalho e resultado.</p>
              <a href="#explorar" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full btn-lime px-6 text-sm font-semibold text-[var(--color-ink)] transition-[transform,filter] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-ink)]">Ver o que dá para construir <ArrowRight className="size-4" /></a>
            </div>
            <div className="border-l border-[var(--signal-border)] pl-6 md:pl-10">
              <div className="flex items-center justify-between border-b border-[var(--signal-border)] pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--signal-muted)]"><span>Base própria</span><span className="text-[var(--signal-blue)]">Atualizada</span></div>
              <dl className="divide-y divide-[var(--signal-border)]">
                {[{value: offers.length,label:"soluções"},{value: articles.length,label:"sinais recentes"},{value: reels.length,label:"reels Saraiva.AI"},{value: offerTypes,label:"tipos de oferta"}].map((item) => <div key={item.label} className="flex items-end justify-between py-5"><dt className="text-sm text-[var(--signal-muted)]">{item.label}</dt><dd className="font-mono text-3xl tracking-[-0.05em]">{item.value}</dd></div>)}
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

        <OfferExplorer offers={offers} />

        {reels.length ? <section className="signal-shell py-16 md:py-24" aria-labelledby="aprofundar-title"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="signal-kicker">03 · Aprofundar</p><h2 id="aprofundar-title" className="signal-section-title">Direto do Instagram.</h2></div><Link href="/content#instagram" className="signal-text-link">Ver todos <ArrowRight className="size-4" /></Link></div><div className="grid gap-px bg-[var(--signal-border)] md:grid-cols-3">{reels.slice(0,3).map((reel) => <a key={reel.id} href={reel.url} target="_blank" rel="noreferrer" className="group bg-[var(--signal-paper)]"><div className="relative aspect-[9/12] overflow-hidden bg-[var(--signal-ink)]"><Image src={reel.thumbnail_url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover transition-[filter,scale] duration-300 group-hover:scale-[1.02]" /><span className="absolute inset-0 grid place-items-center"><span className="grid size-12 place-items-center rounded-full bg-[var(--color-lime)] text-[var(--color-ink)]"><CirclePlay className="size-5" /></span></span></div><div className="p-5"><p className="signal-kicker">@saraiva.ai</p><h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.035em]">{reel.caption}</h3></div></a>)}</div></section> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
