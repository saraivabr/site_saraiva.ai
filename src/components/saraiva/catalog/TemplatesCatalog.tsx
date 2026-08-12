import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

import { type CatalogTemplate } from "./data";

interface TemplatesCatalogProps {
  templates: CatalogTemplate[];
}

export function TemplatesCatalog({ templates }: TemplatesCatalogProps) {
  return (
    <div className="signal-site min-h-screen bg-[var(--signal-paper)]">
      <SiteHeader />
      <main className="signal-shell pb-24 pt-14 md:pt-20">
        <header className="mb-14 grid gap-6 border-b border-[var(--signal-border)] pb-12 md:grid-cols-[180px_1fr]">
          <p className="signal-kicker pt-2">03 · Sistemas</p>
          <div><h1 className="text-[clamp(3rem,7vw,7.5rem)] font-semibold leading-[.84] tracking-[-0.07em]">Templates</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--signal-muted)] md:text-lg">
            Projetos completos com inteligência artificial, documentação e uma
            base pronta para você adaptar ao seu negócio.
          </p></div>
        </header>

        <div className="grid grid-cols-1 gap-px bg-[var(--signal-border)] sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/template/${template.slug}`}
              className="group flex h-full flex-col overflow-hidden bg-[var(--signal-paper)] transition-colors hover:bg-white"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {template.image_url ? (
                  <Image
                    src={template.image_url}
                    alt={template.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {template.category ? (
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--signal-blue)]">
                    {template.category}
                  </p>
                ) : null}
                <h2 className="text-2xl font-semibold leading-[1.05] tracking-[-.04em] group-hover:text-[var(--signal-blue)]">
                  {template.name}
                </h2>
                {template.tagline ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--signal-muted)]">
                    {template.tagline}
                  </p>
                ) : null}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--signal-blue)]">
                  Conhecer template
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
