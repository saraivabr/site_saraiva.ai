import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleDot,
  PlugZap,
  Sparkles,
} from "lucide-react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

import {
  type CatalogTemplate,
  formatPrice,
  safeExternalUrl,
  stripMarkdownEmphasis,
} from "./data";

interface TemplateDetailProps {
  template: CatalogTemplate;
}

export function TemplateDetail({ template }: TemplateDetailProps) {
  const price = formatPrice(template.price_cents);
  const whatsappUrl = `https://wa.me/5511988642668?text=${encodeURIComponent(`Olá, quero saber mais sobre o template ${template.name} da Saraiva.AI.`)}`;

  return (
    <div className="saraiva-site min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[hsl(220_20%_4%)] text-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
            <Link
              href="/templates"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-primary"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Voltar para templates
            </Link>

            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                {template.category ? (
                  <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {template.category}
                  </p>
                ) : null}
                <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[hsl(0_0%_96%)] md:text-6xl">
                  {template.name}
                </h1>
                {template.tagline ? (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-[hsl(0_0%_62%)] md:text-lg">
                    {template.tagline}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] hover:brightness-110">
                    Quero este template <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                  <span className="text-sm text-white/45">{price ? `A partir de ${price}. ` : ""}Atendimento pelo WhatsApp.</span>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                {template.image_url ? (
                  <Image
                    src={template.image_url}
                    alt={template.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-10 px-6 py-12 md:px-8 md:py-16">
          {template.description ? (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
                Sobre o projeto
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Uma base pronta para adaptar
              </h2>
              <p className="mt-5 text-base leading-8 text-secondary-foreground md:text-lg">
                {template.description}
              </p>
            </section>
          ) : null}

          {template.features.length > 0 ? (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <div className="mb-7 flex items-center gap-3">
                <Sparkles aria-hidden="true" className="size-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  O que vem no template
                </h2>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {template.features.map((feature, index) => (
                  <li
                    key={`${template.id}-feature-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check aria-hidden="true" className="size-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed text-secondary-foreground">
                      {stripMarkdownEmphasis(feature)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {template.use_cases.length > 0 ? (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <h2 className="mb-7 text-2xl font-semibold text-foreground">
                Para quem este projeto foi feito
              </h2>
              <ul className="space-y-4">
                {template.use_cases.map((useCase, index) => (
                  <li
                    key={`${template.id}-use-${index}`}
                    className="flex items-start gap-3 text-secondary-foreground"
                  >
                    <CircleDot
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary"
                    />
                    <span className="leading-relaxed">{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            {template.external_integrations.length > 0 ? (
              <section className="rounded-3xl border border-border bg-card p-7 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <PlugZap aria-hidden="true" className="size-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Integrações
                  </h2>
                </div>
                <ul className="space-y-5">
                  {template.external_integrations.map((integration, index) => {
                    const url = safeExternalUrl(integration.url);
                    return (
                      <li key={`${template.id}-integration-${index}`}>
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {integration.name}
                          </a>
                        ) : (
                          <strong className="text-foreground">
                            {integration.name}
                          </strong>
                        )}
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {integration.purpose}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {template.tech_stack.length > 0 ? (
              <section className="rounded-3xl border border-border bg-card p-7 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Tecnologias utilizadas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {template.tech_stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-secondary-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <section className="rounded-3xl bg-[hsl(220_20%_4%)] p-8 text-center text-white md:p-12">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Pronto para colocar este projeto em prática?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
              Entre para continuar e conferir as opções disponíveis para este
              template.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white transition-transform hover:scale-[1.02]">
              Falar sobre este template <ArrowUpRight aria-hidden="true" className="size-5" />
            </a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
