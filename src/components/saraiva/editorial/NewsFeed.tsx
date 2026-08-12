"use client";

import { useState } from "react";

import { EditorialCard } from "./EditorialCard";
import type { EditorialCardItem } from "./format";

const PAGE_SIZE = 24;

export function NewsFeed({ items }: { items: EditorialCardItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const remaining = items.length - visible;

  return (
    <div className="signal-shell py-px">
      <div className="grid gap-px bg-[var(--signal-border)] sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, visible).map((item) => <EditorialCard key={item.id} item={item} />)}
      </div>
      {remaining > 0 ? <button type="button" onClick={() => setVisible((value) => Math.min(value + PAGE_SIZE, items.length))} className="my-8 min-h-12 w-full border border-[var(--signal-ink)] text-sm font-semibold transition-colors hover:bg-[var(--signal-ink)] hover:text-white">Carregar mais {Math.min(PAGE_SIZE, remaining)} notícias</button> : null}
    </div>
  );
}
