import type { ReactNode } from "react";

import { NewsletterModal } from "@/components/saraiva/home/NewsletterModal";
import { SiteFooter } from "@/components/saraiva/home/SiteFooter";
import { SiteHeader } from "@/components/saraiva/home/SiteHeader";

interface StaticPageShellProps {
  children: ReactNode;
}

export function StaticPageShell({ children }: StaticPageShellProps) {
  return (
    <div className="saraiva-site min-h-screen bg-white">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <NewsletterModal />
    </div>
  );
}
