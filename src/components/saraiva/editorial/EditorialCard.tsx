import Image from "next/image";
import Link from "next/link";

import { type EditorialCardItem, formatDate, sourceLabel } from "./format";
import { NewsArt } from "./NewsArt";

export function EditorialCard({ item, compact = false }: { item: EditorialCardItem; compact?: boolean }) {
  const isNews = item.href.startsWith("/news/");

  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgb(226,228,232)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0085FE] hover:shadow-xl hover:shadow-black/5 ${compact ? "w-[300px] shrink-0 snap-start sm:w-[360px]" : ""}`}
    >
      {isNews ? (
        <NewsArt title={item.title} />
      ) : (
        <div className="relative aspect-video overflow-hidden bg-[rgb(238,239,241)]">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes={compact ? "(max-width: 640px) 300px, 360px" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={item.image.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(224,226,230)] to-[rgb(245,245,246)]" />
          )}
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[rgb(35,38,44)] shadow-sm backdrop-blur">
            {sourceLabel(item.label)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-[rgb(18,20,24)]">
          {item.title}
        </h2>
        {item.summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[rgb(93,98,108)]">{item.summary}</p>
        ) : null}
        {item.publishedAt ? (
          <span className="mt-auto pt-4 text-[10px] font-medium uppercase tracking-[0.1em] text-[rgb(113,118,128)]">
            {formatDate(item.publishedAt)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
