"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { EditorialCard } from "./EditorialCard";
import { type EditorialCardItem, formatDate, formatDuration } from "./format";

export type ContentVideoItem = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  duration: number | null;
  publishedAt: string;
};

export type ContentReelItem = {
  id: string;
  url: string;
  caption: string;
  thumbnailUrl: string;
  videoUrl: string | null;
  username: string;
  duration: number | null;
  postedAt: string;
};

function Rail({ title, children }: { title: string; children: React.ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => railRef.current?.scrollBy({ left: direction * 760, behavior: "smooth" });

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-5">
        <h2 className="text-xl font-bold uppercase tracking-[-0.025em] md:text-2xl">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={`Voltar em ${title}`} className="grid size-9 place-items-center rounded-full border border-[rgb(220,223,228)] transition-colors hover:bg-black hover:text-white">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Avançar em ${title}`} className="grid size-9 place-items-center rounded-full border border-[rgb(220,223,228)] transition-colors hover:bg-black hover:text-white">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={railRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}

function ProgressiveRail<T extends { id: string }>({ title, items, renderItem, initial = 12 }: { title: string; items: T[]; renderItem: (item: T) => React.ReactNode; initial?: number }) {
  const [visible, setVisible] = useState(initial);
  return <div><Rail title={title}>{items.slice(0, visible).map(renderItem)}</Rail>{visible < items.length ? <button type="button" onClick={() => setVisible((value) => Math.min(value + initial, items.length))} className="mt-2 min-h-11 border border-[var(--signal-border)] px-5 text-xs font-semibold uppercase tracking-[.08em] hover:border-[var(--signal-ink)]">Mais {title.toLocaleLowerCase("pt-BR")}</button> : null}</div>;
}

function VideoCard({ video }: { video: ContentVideoItem }) {
  return (
    <Link href={`/video/${video.slug}`} className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[rgb(226,228,232)] bg-white sm:w-[360px]">
      <div className="relative aspect-video overflow-hidden bg-black">
        <Image src={video.thumbnailUrl} alt="" fill sizes="(max-width: 640px) 300px, 360px" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        <span className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/20">
          <span className="grid size-12 place-items-center rounded-full bg-[#0085FE] text-white shadow-lg"><Play className="ml-0.5 size-5 fill-current" /></span>
        </span>
        {video.duration ? <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-[11px] font-semibold text-white">{formatDuration(video.duration)}</span> : null}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug tracking-[-0.02em]">{video.title}</h3>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[rgb(113,118,128)]">{formatDate(video.publishedAt)}</p>
      </div>
    </Link>
  );
}

function ReelCard({ video, onOpen }: { video: ContentReelItem; onOpen: (video: ContentReelItem) => void }) {
  return (
    <button type="button" onClick={() => onOpen(video)} className="group w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[rgb(226,228,232)] bg-white text-left sm:w-[260px]">
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        <Image src={video.thumbnailUrl} alt="" fill sizes="260px" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        <span className="absolute inset-0 grid place-items-center bg-black/10 group-hover:bg-black/20">
          <span className="grid size-11 place-items-center rounded-full bg-white/90 text-black"><Play className="ml-0.5 size-5 fill-current" /></span>
        </span>
        {video.duration ? <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-[11px] font-semibold text-white">{formatDuration(video.duration)}</span> : null}
      </div>
      <div className="p-4">
        <p className="line-clamp-3 text-sm leading-5 text-[rgb(55,59,66)]">{video.caption}</p>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[rgb(113,118,128)]">{formatDate(video.postedAt)}</p>
      </div>
    </button>
  );
}

export function ContentHub({
  articles,
  videoItems,
  reelItems,
}: {
  articles: EditorialCardItem[];
  videoItems: ContentVideoItem[];
  reelItems: ContentReelItem[];
}) {
  const [selectedReel, setSelectedReel] = useState<ContentReelItem | null>(null);

  return (
    <>
      <div className="signal-shell space-y-14 py-12 md:space-y-20 md:py-20">
        <ProgressiveRail title="Artigos e colunas" items={articles} renderItem={(item) => <EditorialCard key={item.id} item={item} compact />} />
        {videoItems.length ? <ProgressiveRail title="Vídeos longos Saraiva.AI" items={videoItems} renderItem={(video) => <VideoCard key={video.id} video={video} />} /> : null}
        <div id="instagram"><ProgressiveRail title="Reels do @saraiva.ai" items={reelItems} initial={16} renderItem={(video) => <ReelCard key={video.id} video={video} onOpen={setSelectedReel} />} /></div>
      </div>

      {selectedReel ? (
        <div role="dialog" aria-modal="true" aria-label="Vídeo do Instagram" className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setSelectedReel(null)}>
          <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[rgb(12,14,17)] text-white shadow-2xl md:grid-cols-[minmax(280px,440px)_1fr]" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedReel(null)} aria-label="Fechar" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/60"><X className="size-5" /></button>
            <div className="relative min-h-[55vh] bg-black md:min-h-[75vh]">
              {selectedReel.videoUrl ? (
                <video src={selectedReel.videoUrl} poster={selectedReel.thumbnailUrl} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <Image src={selectedReel.thumbnailUrl} alt="" fill sizes="440px" className="object-contain" unoptimized />
              )}
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#66b7ff]">@{selectedReel.username}</p>
              <p className="mt-5 whitespace-pre-line text-sm leading-6 text-[rgb(205,207,212)]">{selectedReel.caption}</p>
              <a href={selectedReel.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[#66b7ff]">
                Abrir no Instagram <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
