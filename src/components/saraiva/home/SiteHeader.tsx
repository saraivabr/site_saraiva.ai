"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [{label:"Base",href:"/"},{label:"Conteúdo",href:"/content"},{label:"Notícias",href:"/news"},{label:"Templates",href:"/templates"},{label:"Sobre",href:"/about"}];

export function SiteHeader() {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="sticky top-0 z-50 border-b border-[var(--signal-border)] bg-[color:var(--signal-paper)]/95 backdrop-blur-xl"><div className="signal-shell flex h-16 items-center justify-between"><Link href="/" onClick={() => setOpen(false)} className="text-xl font-semibold tracking-[-0.055em]">saraiva<span className="text-[var(--signal-blue)]">.ai</span></Link><nav className="hidden h-full items-center md:flex" aria-label="Navegação principal">{items.map((item) => <Link key={item.href} href={item.href} className={`grid h-full place-items-center border-l border-[var(--signal-border)] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-[var(--signal-soft)] ${pathname === item.href ? "text-[var(--signal-blue)]" : "text-[var(--signal-muted)]"}`}>{item.label}</Link>)}<Link href="/#newsletter" className="grid h-full place-items-center bg-[var(--signal-ink)] px-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-[var(--signal-blue)]">Receber sinais</Link></nav><button type="button" onClick={() => setOpen((value) => !value)} className="grid size-11 place-items-center md:hidden" aria-expanded={open} aria-controls="signal-mobile-nav" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>{open ? <nav id="signal-mobile-nav" className="border-t border-[var(--signal-border)] bg-[var(--signal-paper)] px-5 py-4 md:hidden">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between border-b border-[var(--signal-border)] text-sm font-semibold">{item.label}<ArrowRight /></Link>)}<Link href="/#newsletter" onClick={() => setOpen(false)} className="mt-4 flex min-h-12 items-center justify-between bg-[var(--signal-ink)] px-4 text-sm font-semibold text-white">Receber sinais<ArrowRight /></Link></nav> : null}</header>;
}

function ArrowRight() { return <span aria-hidden="true">↗</span>; }
