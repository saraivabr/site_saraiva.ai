"use client";

import { useState } from "react";

import type { CatalogTag, CatalogTool } from "@/components/saraiva/catalog/data";
import { HeroSearchSection } from "./HeroSearchSection";
import { NewsletterModal } from "./NewsletterModal";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { TagMarqueeSection } from "./TagMarqueeSection";
import { ToolGridSection } from "./ToolGridSection";

export function HomeExperience({
  tools,
  tags,
  catalogAvailable,
}: {
  tools: CatalogTool[];
  tags: CatalogTag[];
  catalogAvailable: boolean;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="saraiva-site">
      <SiteHeader />
      <main>
        <HeroSearchSection query={query} onQueryChange={setQuery} />
        <TagMarqueeSection tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />
        <ToolGridSection key={`${query}:${activeTag ?? "all"}`} tools={tools} activeTag={activeTag} query={query} catalogAvailable={catalogAvailable} />
      </main>
      <SiteFooter />
      <NewsletterModal />
    </div>
  );
}
