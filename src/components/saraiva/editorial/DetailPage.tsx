import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { EditorialCard } from "./EditorialCard";
import { EditorialShell } from "./EditorialShell";
import { formatDate } from "./format";
import type { EditorialCardItem } from "./format";

export function DetailPage({
  backHref = "/content",
  backLabel = "Voltar para conteúdo",
  label,
  title,
  date,
  image,
  externalUrl,
  externalLabel,
  children,
  omitRelatedId,
  related = [],
}: {
  backHref?: string;
  backLabel?: string;
  label: string;
  title: string;
  date: string | null;
  image?: string | null;
  externalUrl?: string;
  externalLabel?: string;
  children: ReactNode;
  omitRelatedId?: string;
  related?: EditorialCardItem[];
}) {
  const relatedItems = related.filter((item) => item.id !== omitRelatedId).slice(0, 4);

  return (
    <EditorialShell>
      <main>
        <section className="bg-[rgb(8,10,12)]">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
            <Link href={backHref} className="text-sm font-medium text-[rgb(148,151,158)] transition-colors hover:text-white">
              ← {backLabel}
            </Link>
            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#66b7ff]">{label}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-[-0.045em] text-[rgb(245,245,245)] sm:text-5xl md:text-6xl md:leading-[1.05]">
              {title}
            </h1>
            {date ? <p className="mt-5 text-sm text-[rgb(148,151,158)]">{formatDate(date, true)}</p> : null}
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8 md:py-16">
          {image ? (
            <div className="relative mb-12 aspect-video overflow-hidden rounded-3xl bg-[rgb(238,239,241)]">
              <Image src={image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" unoptimized={image.startsWith("http")} />
            </div>
          ) : null}
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-10 inline-flex rounded-full bg-[#0085FE] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              {externalLabel ?? "Ler publicação original"} ↗
            </a>
          ) : null}
          <div className="mx-auto max-w-3xl">{children}</div>
        </article>

        <section className="border-t border-[rgb(226,228,232)] bg-[rgb(248,248,249)]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
            <h2 className="mb-7 text-2xl font-bold uppercase tracking-[-0.03em]">Continue explorando</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((item) => <EditorialCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
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
