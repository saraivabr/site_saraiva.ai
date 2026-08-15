"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const questions = [
  { id: "volume", title: "Quantos leads ou solicitações sua empresa recebe por mês?", options: [["Até 30", 0], ["31 a 100", 1], ["101 a 500", 2], ["Mais de 500", 3]] },
  { id: "response", title: "Quanto tempo normalmente leva a primeira resposta?", options: [["Até 5 minutos", 0], ["Até 1 hora", 1], ["No mesmo dia", 2], ["Mais de um dia ou varia muito", 3]] },
  { id: "register", title: "Todos os contatos ficam registrados com responsável e próxima ação?", options: [["Sim, sempre", 0], ["Na maioria das vezes", 1], ["Parcialmente", 2], ["Não temos controle", 3]] },
  { id: "followup", title: "Como funciona o acompanhamento de quem não compra na primeira conversa?", options: [["Processo medido e consistente", 0], ["A equipe tenta acompanhar", 1], ["Depende de cada pessoa", 2], ["Quase não existe", 3]] },
  { id: "dependency", title: "Quanto da operação depende de uma pessoa específica?", options: [["Quase nada", 0], ["Algumas decisões", 1], ["Muitos processos", 2], ["A operação trava sem ela", 3]] },
  { id: "integration", title: "WhatsApp, agenda, CRM e sistemas compartilham os mesmos dados?", options: [["Sim", 0], ["Em parte", 1], ["Com trabalho manual", 2], ["São totalmente separados", 3]] },
  { id: "visibility", title: "Você sabe exatamente onde perde oportunidades hoje?", options: [["Sim, com números", 0], ["Tenho uma boa noção", 1], ["Só percebo alguns casos", 2], ["Não consigo enxergar", 3]] },
  { id: "priority", title: "Qual resultado mais importa nos próximos 90 dias?", options: [["Vender mais", 2], ["Responder e atender melhor", 2], ["Reduzir trabalho manual", 2], ["Ter controle da operação", 2]] },
];

export default function DiagnosticoPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const complete = step >= questions.length;
  const score = useMemo(() => Object.values(answers).reduce((sum, value) => sum + value, 0), [answers]);
  const percentage = Math.round((score / (questions.length * 3)) * 100);
  const level = percentage >= 65 ? "Gargalo crítico" : percentage >= 35 ? "Operação vulnerável" : "Base organizada";
  const whatsapp = `https://wa.me/5511988642668?text=${encodeURIComponent(`Fiz o diagnóstico da Saraiva.AI. Resultado: ${level} (${percentage}%). Quero mapear os gargalos e entender o primeiro passo.`)}`;

  if (complete) {
    return (
      <main className="min-h-screen bg-[var(--signal-paper)] text-[var(--signal-ink)]">
        <div className="signal-shell py-16 md:py-24">
          <Link href="/" className="signal-text-link"><ArrowLeft className="size-4" /> Voltar</Link>
          <div className="mt-12 max-w-3xl border border-[var(--signal-border)] bg-white p-7 md:p-12">
            <CheckCircle2 className="size-9 text-[var(--signal-blue)]" />
            <p className="signal-kicker mt-8">Resultado inicial</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[.9] tracking-[-.06em] md:text-7xl">{level}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--signal-muted)]">Seu índice de fricção operacional ficou em <strong className="text-[var(--signal-ink)]">{percentage}%</strong>. Isso não é um laudo automático: é o ponto de partida para localizar onde vendas, tempo ou controle estão escapando.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Mapear a jornada real", "Calcular o custo da fricção", "Escolher o primeiro resultado"].map((item, index) => <div key={item} className="border border-[var(--signal-border)] p-4"><span className="font-mono text-xs text-[var(--signal-blue)]">0{index + 1}</span><p className="mt-3 text-sm font-semibold">{item}</p></div>)}
            </div>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex min-h-14 items-center gap-3 bg-[var(--signal-blue)] px-6 font-semibold text-white hover:bg-[var(--signal-ink)]">Enviar resultado e mapear gargalo <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[step];
  return (
    <main className="min-h-screen bg-[var(--signal-paper)] text-[var(--signal-ink)]">
      <div className="signal-shell py-10 md:py-16">
        <div className="flex items-center justify-between"><Link href="/" className="text-xl font-semibold tracking-[-.05em]">saraiva<span className="text-[var(--signal-blue)]">.ai</span></Link><span className="font-mono text-xs text-[var(--signal-muted)]">{step + 1}/{questions.length}</span></div>
        <div className="mt-8 h-1 bg-[var(--signal-border)]"><div className="h-full bg-[var(--signal-blue)] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        <section className="mx-auto max-w-3xl py-16 md:py-24">
          <p className="signal-kicker">Diagnóstico operacional</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[.98] tracking-[-.05em] md:text-6xl">{question.title}</h1>
          <div className="mt-10 grid gap-3">
            {question.options.map(([label, value]) => (
              <button key={String(label)} type="button" onClick={() => { setAnswers((current) => ({ ...current, [question.id]: Number(value) })); setStep((current) => current + 1); }} className="flex min-h-16 items-center justify-between border border-[var(--signal-border)] bg-white px-5 text-left font-semibold transition hover:border-[var(--signal-blue)] hover:text-[var(--signal-blue)]">
                {label}<ArrowRight className="size-4" />
              </button>
            ))}
          </div>
          {step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--signal-muted)]"><ArrowLeft className="size-4" /> Voltar</button> : null}
        </section>
      </div>
    </main>
  );
}
