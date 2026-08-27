"use client";

import { ArrowRight, CheckCircle2, CircleDot } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Challenge, loadChallenges } from "@/lib/challenges";

import { ProductHeader } from "./ProductHeader";

export function ChallengeHistory() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setChallenges(loadChallenges()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="product-page min-h-screen">
      <ProductHeader />
      <main className="product-list-page product-shell">
        <div className="product-list-heading">
          <div><span className="product-kicker">Continue de onde parou</span><h1>Meus desafios</h1></div>
          <Link href="/#novo" className="challenge-primary-button">+ Novo desafio</Link>
        </div>
        {challenges === null ? <p>Carregando...</p> : challenges.length ? (
          <div className="challenge-history-list">
            {challenges.map((challenge) => {
              const completed = challenge.plan.filter((step) => step.status === "completed").length;
              const progress = challenge.plan.length ? Math.round((completed / challenge.plan.length) * 100) : 0;
              return (
                <Link key={challenge.id} href={`/desafio?id=${encodeURIComponent(challenge.id)}`} className="challenge-history-card">
                  <div className="challenge-history-status">{challenge.status === "completed" ? <CheckCircle2 /> : <CircleDot />}<span>{challenge.status === "completed" ? "Resolvido" : "Em andamento"}</span></div>
                  <h2>{challenge.title}</h2>
                  <p>{challenge.objective || challenge.originalInput}</p>
                  <div className="challenge-history-footer"><span><b>{progress}%</b> concluído</span><span>Continuar <ArrowRight className="size-4" /></span></div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="product-empty-card"><h2>Seu primeiro resultado começa com uma frase.</h2><p>Conte o que você quer conseguir. A Saraiva.AI organiza o resto com você.</p><Link href="/#novo" className="challenge-primary-button">Criar primeiro desafio <ArrowRight className="size-4" /></Link></div>
        )}
        <p className="product-local-note">Por enquanto, seus desafios ficam salvos somente neste dispositivo.</p>
      </main>
    </div>
  );
}
