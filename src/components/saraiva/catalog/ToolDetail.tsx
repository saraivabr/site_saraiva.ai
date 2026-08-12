import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageSquareQuote } from "lucide-react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

import {
  type CatalogTool,
  parseToolContext,
  safeExternalUrl,
} from "./data";
import { SafeHtml } from "./SafeHtml";
import { ShareButton } from "./ShareButton";

const overviewFields = [
  { key: "founders", label: "Fundadores", icon: "👥" },
  { key: "funding", label: "Investimento", icon: "💰" },
  { key: "headquarters", label: "Sede", icon: "🏢" },
  { key: "users", label: "Usuários", icon: "👤" },
  { key: "hosting", label: "Hospedagem", icon: "🖥️" },
  { key: "security", label: "Segurança", icon: "🔒" },
  { key: "support", label: "Suporte", icon: "🎧" },
  { key: "pricing", label: "Preços", icon: "💳" },
  { key: "pricing_type", label: "Modelo de preço", icon: "🏷️" },
  { key: "use_cases", label: "Aplicações", icon: "🎯" },
  { key: "criticisms", label: "Críticas", icon: "⚠️" },
  { key: "praises", label: "Elogios", icon: "⭐" },
] as const;

interface ToolDetailProps {
  tool: CatalogTool;
}

export function ToolDetail({ tool }: ToolDetailProps) {
  const context = parseToolContext(tool.additional_context);
  const accessUrl = safeExternalUrl(tool.url);
  const useCases = context?.use_cases_list?.filter(Boolean) ?? [];
  const overview = overviewFields.flatMap((field) => {
    const value = context?.[field.key];
    return typeof value === "string" && value.trim()
      ? [{ ...field, value: value.trim() }]
      : [];
  });
  const description = tool.description
    .replace(
      /((<br\s*\/?>|\s)*#[\w\sáàâãéèêíïóôõöúçñ#]+)+\s*$/gi,
      "",
    )
    .trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.short_description || description.replace(/<[^>]+>/g, " "),
    url: tool.url,
    image: tool.screenshot_url || undefined,
    applicationCategory: "AIApplication",
  };

  return (
    <div className="saraiva-site min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c"),
        }}
      />

      <main>
        <section className="bg-[hsl(220_20%_4%)] text-white">
          <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-24">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-primary"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Voltar
            </Link>

            <h1 className="flex items-center gap-4 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[hsl(0_0%_96%)] sm:text-5xl md:text-6xl">
              {tool.name}
            </h1>

            {tool.short_description ? (
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[hsl(0_0%_58%)] md:text-lg">
                {tool.short_description}
              </p>
            ) : null}

            {tool.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${encodeURIComponent(tag.slug)}`}
                    className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/65 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {accessUrl ? (
                <a
                  href={accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold tracking-tight text-white transition-all hover:scale-[1.02] hover:brightness-110 md:px-10 md:py-5 md:text-lg"
                >
                  Acessar Ferramenta
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </a>
              ) : null}
              <ShareButton name={tool.name} path={`/tool/${tool.slug}`} />
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-6 py-10 md:px-8 md:py-16">
          {tool.screenshot_url ? (
            <div className="overflow-hidden rounded-3xl bg-muted">
              <Image
                src={tool.screenshot_url}
                alt={`Captura de tela da ferramenta ${tool.name}`}
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 960px"
                className="h-auto w-full"
                priority
                unoptimized
              />
            </div>
          ) : null}

          {description ? (
            <section className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <SafeHtml
                html={description}
                className="max-w-full overflow-hidden break-words leading-relaxed text-secondary-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_img]:h-auto [&_img]:max-w-full [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
              />
            </section>
          ) : null}

          {useCases.length > 0 ? (
            <section className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <h2 className="mb-6 text-xl font-bold text-foreground">
                🎯 Casos de Uso
              </h2>
              <ol className="grid gap-3 sm:grid-cols-2">
                {useCases.map((useCase, index) => (
                  <li
                    key={`${tool.id}-case-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4"
                  >
                    <span className="mt-0.5 text-sm font-bold text-primary">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-secondary-foreground">
                      {useCase}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {overview.length > 0 ? (
            <section className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <h2 className="mb-6 text-xl font-bold text-foreground">
                Visão Geral
              </h2>
              <dl className="overflow-hidden rounded-2xl border border-border text-sm">
                {overview.map((row, index) => (
                  <div
                    key={row.key}
                    className={`grid gap-2 border-b border-border/60 px-5 py-4 last:border-0 md:grid-cols-[176px_1fr] ${
                      index % 2 === 0 ? "bg-muted/50" : "bg-card"
                    }`}
                  >
                    <dt className="font-semibold text-foreground">
                      <span className="mr-2.5">{row.icon}</span>
                      {row.label}
                    </dt>
                    <dd className="whitespace-pre-wrap leading-relaxed text-secondary-foreground">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {tool.user_reviews ? (
            <section className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <MessageSquareQuote
                  aria-hidden="true"
                  className="size-6 text-primary"
                />
                <h2 className="text-xl font-bold text-foreground">
                  O que dizem os usuários
                </h2>
              </div>
              <SafeHtml
                html={tool.user_reviews}
                className="max-w-full overflow-hidden break-words leading-relaxed text-secondary-foreground [&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_cite]:mt-2 [&_cite]:block [&_cite]:font-semibold [&_cite]:not-italic [&_cite]:text-foreground [&_p]:mb-3"
              />
            </section>
          ) : null}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
