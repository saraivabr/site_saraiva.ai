import type { ReactNode } from "react";

import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

interface StaticPageShellProps {
  children: ReactNode;
}

export function StaticPageShell({ children }: StaticPageShellProps) {
  return (
    <div className="signal-site min-h-screen bg-[var(--signal-paper)]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
