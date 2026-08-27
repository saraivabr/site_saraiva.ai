"use client";

import { ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Challenge, loadChallenges } from "@/lib/challenges";

import { ProductHeader } from "./ProductHeader";

export function CapabilityProfile() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setChallenges(loadChallenges());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const demonstrated = useMemo(() => [...new Set(challenges.filter((item) => item.status === "completed").flatMap((item) => item.capabilities))], [challenges]);
  const developing = useMemo(() => [...new Set(challenges.filter((item) => item.status !== "completed").flatMap((item) => item.capabilities))].filter((item) => !demonstrated.includes(item)), [challenges, demonstrated]);
  const completed = challenges.filter((item) => item.status === "completed").length;

  return (
    <div className="product-page min-h-screen">
      <ProductHeader />
      <main className="product-list-page product-shell">
        <div className="product-list-heading"><div><span className="product-kicker">O que você consegue fazer</span><h1>Suas capacidades</h1><p>Seu perfil cresce com evidências de desafios reais — não com conteúdo consumido.</p></div></div>
        <div className="capability-summary"><div><strong>{loaded ? challenges.length : "—"}</strong><span>desafios iniciados</span></div><div><strong>{loaded ? completed : "—"}</strong><span>resultados conquistados</span></div><div><strong>{loaded ? demonstrated.length : "—"}</strong><span>capacidades demonstradas</span></div></div>
        <section className="capability-section"><div><CheckCircle2 /><span className="product-kicker">Demonstradas</span></div>{demonstrated.length ? <ul>{demonstrated.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Conclua um desafio e registre o resultado para construir esta lista.</p>}</section>
        <section className="capability-section"><div><CircleDashed /><span className="product-kicker">Em desenvolvimento</span></div>{developing.length ? <ul>{developing.map((item) => <li key={item}>{item}</li>)}</ul> : <p>As capacidades praticadas nos seus desafios em andamento aparecerão aqui.</p>}</section>
        <Link href="/#novo" className="challenge-primary-button mt-10">Aumentar minha capacidade <ArrowRight className="size-4" /></Link>
      </main>
    </div>
  );
}
