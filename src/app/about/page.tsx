import type { Metadata } from "next";
import { AboutPage } from "@/components/saraiva/static/AboutPage";
import { StaticPageShell } from "@/components/saraiva/static/StaticPageShell";

export const metadata: Metadata = { title: "Sobre", description: "A Saraiva.AI transforma desafios em soluções e aumenta aquilo que uma pessoa consegue fazer.", alternates: { canonical: "/about" } };
export default function AboutRoute() { return <StaticPageShell><AboutPage /></StaticPageShell>; }
