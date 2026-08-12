import type { ReactNode } from "react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

export function EditorialShell({ children }: { children: ReactNode }) {
  return (
    <div className="saraiva-site min-h-screen bg-white text-[rgb(16,18,22)]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

export function EditorialHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-[rgb(8,10,12)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        {eyebrow ? (
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#66b7ff]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-5xl text-4xl font-bold uppercase tracking-[-0.04em] text-[rgb(245,245,245)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[rgb(148,151,158)] md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
