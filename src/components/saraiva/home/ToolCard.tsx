"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ExternalLinkIcon, HeartIcon } from "@/components/saraiva/shared/icons";
import type { CatalogCardTool } from "@/types/catalog";

interface ToolCardProps {
  tool: CatalogCardTool;
}

function separateTags(tags: string[]) {
  return tags.flatMap((tag) => tag.match(/#[^#\s]+/g) ?? [tag]);
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const tags = separateTags(tool.tags);

  return (
    <article className="relative overflow-hidden rounded-[24px] bg-black/[0.06] transition-colors duration-300">
      <Link
        className="group block rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={tool.href}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-[24px]">
          <Image
            alt={tool.imageAlt}
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={tool.imageSrc ?? "/brand/favicon.png"}
            unoptimized={tool.imageSrc?.startsWith("http")}
          />

          <span className="absolute bottom-3 left-3 flex translate-y-1 items-center gap-1.5 rounded-full bg-[rgba(16,19,24,0.82)] px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            Ver ferramenta
            <ExternalLinkIcon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          </span>
        </div>

        <div className="min-h-[168px] rounded-b-[24px] p-6 transition-colors duration-500 group-hover:bg-[rgba(16,19,24,0.965)]">
          <h3 className="text-[18px]/[24.75px] font-medium tracking-[-0.45px] text-foreground transition-colors duration-500 group-hover:text-primary">
            {tool.name}
          </h3>
          <p className="mt-[10px] overflow-hidden text-[14px]/[22.75px] text-[rgb(79,86,100)] transition-colors duration-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-[rgb(233,234,236)]">
            {tool.description}
          </p>

          {tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px]/[14px] font-medium text-[rgb(79,86,100)] transition-colors duration-500 group-hover:bg-white/10 group-hover:text-[rgb(233,234,236)]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>

      <button
        aria-label={isFavorite ? `Remover ${tool.name} dos favoritos` : `Favoritar ${tool.name}`}
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-[rgba(16,19,24,0.62)] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-[rgba(16,19,24,0.82)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setIsFavorite((favorite) => !favorite)}
        type="button"
      >
        <HeartIcon
          aria-hidden="true"
          className={`size-4 transition-[fill,color] duration-300 ${isFavorite ? "fill-current text-primary" : "fill-transparent"}`}
          strokeWidth={1.75}
        />
      </button>
    </article>
  );
}
