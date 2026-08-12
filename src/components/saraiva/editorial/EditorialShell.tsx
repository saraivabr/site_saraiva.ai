import type { ReactNode } from "react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

export function EditorialShell({ children }: { children: ReactNode }) {
  return (
    <div className="signal-site min-h-screen bg-[var(--signal-paper)] text-[var(--signal-ink)]">
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
    <section className="border-b border-[var(--signal-border)]">
      <div className="signal-shell grid gap-8 py-14 md:grid-cols-[180px_1fr] md:py-20">
        {eyebrow ? (
          <p className="signal-kicker pt-2">
            {eyebrow}
          </p>
        ) : <p className="signal-kicker pt-2">Arquivo vivo</p>}
        <div>
          <h1 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-semibold leading-[.84] tracking-[-0.07em]">{title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--signal-muted)] md:text-lg">{description}</p>
        </div>
      </div>
    </section>
  );
}
