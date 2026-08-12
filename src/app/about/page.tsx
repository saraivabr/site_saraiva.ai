import type { Metadata } from "next";
import { AboutPage } from "@/components/saraiva/static/AboutPage";
import { StaticPageShell } from "@/components/saraiva/static/StaticPageShell";

export const metadata: Metadata = { title: "Sobre", description: "Conheça a Saraiva.AI: curadoria, construção e implementação de inteligência artificial.", alternates: { canonical: "/about" } };
export default function AboutRoute() { return <StaticPageShell><AboutPage /></StaticPageShell>; }
