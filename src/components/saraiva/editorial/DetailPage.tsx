import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { EditorialCard } from "./EditorialCard";
import { EditorialShell } from "./EditorialShell";
import { formatDate } from "./format";
import type { EditorialCardItem } from "./format";
import { NewsArt } from "./NewsArt";

export function DetailPage({
  backHref = "/content",
  backLabel = "Voltar para conteúdo",
  label,
  title,
  author,
  date,
  image,
  externalUrl,
  externalLabel,
  cta,
  children,
  omitRelatedId,
  related = [],
  brandedNewsArt = false,
}: {
  backHref?: string;
  backLabel?: string;
  label: string;
  title: string;
  author?: string | null;
  date: string | null;
  image?: string | null;
  externalUrl?: string;
  externalLabel?: string;
  cta?: { href: string; label: string; description: string; title?: string };
  children: ReactNode;
  omitRelatedId?: string;
  related?: EditorialCardItem[];
  brandedNewsArt?: boolean;
}) {
  const relatedItems = related.filter((item) => item.id !== omitRelatedId).slice(0, 4);

  return (
    <EditorialShell>
      <main>
        <section className="border-b border-[var(--signal-border)]">
          <div className="signal-shell py-12 md:py-20">
            <Link href={backHref} className="text-sm font-semibold text-[var(--signal-muted)] transition-colors hover:text-[var(--signal-blue)]">
              ← {backLabel}
            </Link>
            <p className="signal-kicker mt-10">{label}</p>
            <h1 className="mt-5 max-w-5xl text-[clamp(2.8rem,6.5vw,7rem)] font-semibold leading-[.9] tracking-[-0.065em]">
              {title}
            </h1>
            {(date || author) ? <p className="mt-6 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--signal-muted)]">{author ? `Por ${author}` : null}{author && date ? " · " : null}{date ? formatDate(date, true) : null}</p> : null}
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 md:py-16">
          {brandedNewsArt ? (
            <div className="mb-12 overflow-hidden border border-[var(--signal-border)]">
              <NewsArt title={title} image={image} priority />
            </div>
          ) : image ? (
            <div className="relative mb-12 aspect-video overflow-hidden border border-[var(--signal-border)] bg-[var(--signal-soft)]">
              <Image src={image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" unoptimized={image.startsWith("http")} />
            </div>
          ) : null}
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-10 inline-flex bg-[var(--signal-blue)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--signal-ink)]"
            >
              {externalLabel ?? "Ler publicação original"} ↗
            </a>
          ) : null}
          <div className="mx-auto max-w-3xl">{children}</div>
          {cta ? <aside className="mx-auto mt-14 max-w-3xl border-l-4 border-[var(--signal-blue)] bg-[var(--signal-ink)] p-7 text-white md:p-9"><p className="signal-kicker text-[var(--signal-sky)]">Próxima ação</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">{cta.title ?? "Transforme leitura em aplicação."}</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">{cta.description}</p><a href={cta.href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center bg-[var(--signal-blue)] px-5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[var(--signal-ink)]">{cta.label} ↗</a></aside> : null}
        </article>

        {relatedItems.length ? <section className="border-t border-[var(--signal-border)] bg-[var(--signal-soft)]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
            <p className="signal-kicker">Próximo sinal</p><h2 className="mb-8 mt-3 text-4xl font-semibold tracking-[-0.05em]">Continue explorando</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((item) => <EditorialCard key={item.id} item={item} />)}
            </div>
          </div>
        </section> : null}
      </main>
    </EditorialShell>
  );
}

export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="mb-12 aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl shadow-black/10">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
