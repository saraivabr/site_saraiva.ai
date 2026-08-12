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
    <div className="saraiva-site min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:px-8">
        <header className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Sistemas prontos para usar
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Projetos completos com inteligência artificial, documentação e uma
            base pronta para você adaptar ao seu negócio.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/template/${template.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
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
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-primary">
                    {template.category}
                  </p>
                ) : null}
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                  {template.name}
                </h2>
                {template.tagline ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {template.tagline}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
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
