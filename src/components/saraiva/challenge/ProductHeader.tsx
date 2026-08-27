"use client";

import { Menu, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { label: "+ Novo desafio", mobileLabel: "Novo desafio", href: "/#novo", icon: Plus },
  { label: "Meus desafios", href: "/desafios" },
  { label: "Perfil", href: "/perfil" },
];

export function ProductHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="product-header">
      <div className="product-shell flex h-[72px] items-center justify-between">
        <Link href="/" className="product-logo" onClick={() => setOpen(false)} aria-label="Saraiva.AI — início">
          saraiva<span>.ai</span>
        </Link>

        <nav className="hidden h-full items-center md:flex" aria-label="Navegação principal">
          {items.map((item) => {
            const active = item.href !== "/#novo" && pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="product-nav-link">
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="product-mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav id="product-mobile-nav" className="product-mobile-nav" aria-label="Navegação móvel">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.mobileLabel ?? item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
