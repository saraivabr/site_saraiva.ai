"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/saraiva/shared/icons";

const navigationItems = [
  { label: "GUIA", href: "/" },
  { label: "CONTEÚDO", href: "/content" },
  { label: "NOTÍCIAS", href: "/news" },
  { label: "TEMPLATES", href: "/templates" },
  { label: "SOBRE", href: "/about" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" || pathname.startsWith("/tool/") : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className={`sticky top-0 z-50 overflow-hidden border-b border-white/10 bg-[#07090d]/95 backdrop-blur-2xl transition-[height] ${open ? "h-[420px]" : "h-[72px]"} md:h-[72px]`}>
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 md:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Saraiva.AI — página inicial" className="flex items-center">
          <Image src="/brand/saraiva-ai-logo.png" alt="Saraiva.AI" width={190} height={56} className="h-10 w-auto brightness-0 invert" priority />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => <Link key={item.href} href={item.href} className={`rounded-full px-3 py-2 text-xs font-semibold tracking-[0.04em] transition-colors ${active(item.href) ? "bg-white/10 text-white" : "text-white/45 hover:text-white"}`}>{item.label}</Link>)}
          <Link href="/#newsletter" className="ml-2 rounded-full bg-[#0085FE] px-4 py-2 text-xs font-bold text-white hover:bg-[#1b91ff]">NEWSLETTER</Link>
        </nav>
        <button type="button" className="grid size-10 place-items-center text-white/70 md:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}</button>
      </div>
      {open ? <nav id="mobile-menu" aria-label="Navegação móvel" className="space-y-1 px-5 pt-3 md:hidden">{navigationItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`block rounded-2xl px-4 py-3 text-sm font-semibold ${active(item.href) ? "bg-white/10 text-white" : "text-white/50"}`}>{item.label}</Link>)}<Link href="/#newsletter" onClick={() => setOpen(false)} className="mt-4 block rounded-2xl bg-[#0085FE] px-4 py-3 text-center text-sm font-bold text-white">Assinar newsletter</Link></nav> : null}
    </header>
  );
}
