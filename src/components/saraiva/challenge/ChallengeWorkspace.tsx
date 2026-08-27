"use client";

import { ArrowRight, Check, CheckCircle2, Circle, LoaderCircle, RotateCcw, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  Challenge,
  ChallengeInterpretation,
  ChallengeResponse,
  PENDING_CHALLENGE_KEY,
  loadChallenge,
  newMessage,
  saveChallenge,
} from "@/lib/challenges";

import { MarkdownContent } from "@/components/saraiva/editorial/MarkdownContent";
import { ProductHeader } from "./ProductHeader";

export function ChallengeWorkspace() {
  const searchParams = useSearchParams();
  const booted = useRef(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [correction, setCorrection] = useState("");
  const [showResultForm, setShowResultForm] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const id = searchParams.get("id");
    if (id) {
      setChallenge(loadChallenge(id));
      setLoading(false);
      return;
    }

    const pending = window.sessionStorage.getItem(PENDING_CHALLENGE_KEY)?.trim();
    if (!pending) {
      setLoading(false);
      return;
    }
    window.sessionStorage.removeItem(PENDING_CHALLENGE_KEY);
    void beginChallenge(pending);
    // A inicialização é intencionalmente única; mudanças posteriores de query não devem reiniciar o desafio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [challenge?.messages.length]);

  const currentStepIndex = useMemo(
    () => challenge?.plan.findIndex((step) => step.status === "active") ?? -1,
    [challenge?.plan],
  );
  const currentStep = currentStepIndex >= 0 ? challenge?.plan[currentStepIndex] : null;
  const completedCount = challenge?.plan.filter((step) => step.status === "completed").length ?? 0;
  const progress = challenge?.plan.length ? Math.round((completedCount / challenge.plan.length) * 100) : 0;

  function persist(next: Challenge) {
    setChallenge(next);
    saveChallenge(next);
  }

  async function beginChallenge(originalInput: string, correctionText = "", existing?: Challenge) {
    setLoading(!existing);
    setSending(Boolean(existing));
    setError("");
    const now = new Date().toISOString();
    const base = existing ?? {
      id: window.crypto.randomUUID(),
      originalInput,
      title: "Entendendo seu desafio",
      objective: "",
      expectedResult: "",
      interpretation: "",
      status: "interpreting" as const,
      plan: [],
      messages: [newMessage("user", originalInput)],
      artifact: { title: "Resultado em construção", content: "Seu primeiro artefato aparecerá aqui durante a execução." },
      result: "",
      capabilities: [],
      createdAt: now,
      updatedAt: now,
    };
    persist(base);

    try {
      const response = await fetch("/api/challenges/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge: originalInput, correction: correctionText }),
      });
      const data = (await response.json()) as ChallengeInterpretation & { error?: string };
      if (!response.ok) throw new Error(data.error || "Não consegui interpretar este desafio.");

      const updated: Challenge = {
        ...base,
        title: data.title,
        objective: data.objective,
        expectedResult: data.expectedResult,
        interpretation: data.interpretation,
        status: "confirmation",
        plan: data.plan.map((step, index) => ({ ...step, id: window.crypto.randomUUID(), status: index === 0 ? "active" : "pending" })),
        messages: [...base.messages, newMessage("assistant", `${data.interpretation}\n\n${data.confirmationQuestion}`)],
        updatedAt: new Date().toISOString(),
      };
      persist(updated);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não consegui interpretar este desafio.");
    } finally {
      setLoading(false);
      setSending(false);
    }
  }

  function confirmInterpretation() {
    if (!challenge) return;
    const firstStep = challenge.plan[0];
    const nextAction = firstStep ? `${firstStep.title}. ${firstStep.outcome}` : "Definir a primeira ação.";
    persist({
      ...challenge,
      status: "active",
      messages: [...challenge.messages, newMessage("user", "Sim, é isso."), newMessage("assistant", `Perfeito. Vamos começar sem complicar.\n\nPróxima ação: ${nextAction}`)],
      updatedAt: new Date().toISOString(),
    });
  }

  function submitCorrection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || correction.trim().length < 2) return;
    const correctionText = correction.trim();
    const existing = {
      ...challenge,
      status: "interpreting" as const,
      messages: [...challenge.messages, newMessage("user", correctionText)],
      updatedAt: new Date().toISOString(),
    };
    setCorrection("");
    void beginChallenge(challenge.originalInput, correctionText, existing);
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || sending || message.trim().length < 1) return;
    const userText = message.trim();
    const withUser = {
      ...challenge,
      messages: [...challenge.messages, newMessage("user", userText)],
      updatedAt: new Date().toISOString(),
    };
    setMessage("");
    setSending(true);
    setError("");
    persist(withUser);

    const challengeContext = JSON.stringify({
      objetivo: challenge.objective,
      resultado_esperado: challenge.expectedResult,
      etapa_atual: currentStep,
      plano: challenge.plan,
      artefato_atual: challenge.artifact,
      resultado_registrado: challenge.result,
    });
    const recentConversation = challenge.messages.slice(-8).map((item) => `${item.role === "user" ? "Usuário" : "Saraiva.AI"}: ${item.content}`).join("\n");

    try {
      const response = await fetch("/api/challenges/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge: challengeContext, conversation: recentConversation, message: userText }),
      });
      const data = (await response.json()) as ChallengeResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Não consegui continuar agora.");

      const capabilities = data.capabilitySignal && !challenge.capabilities.includes(data.capabilitySignal)
        ? [...challenge.capabilities, data.capabilitySignal]
        : challenge.capabilities;
      persist({
        ...withUser,
        messages: [...withUser.messages, newMessage("assistant", `${data.message}\n\nPróxima ação: ${data.nextAction}`)],
        artifact: data.artifactContent ? { title: data.artifactTitle || challenge.artifact.title, content: data.artifactContent } : challenge.artifact,
        result: data.resultSignal || challenge.result,
        capabilities,
        updatedAt: new Date().toISOString(),
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não consegui continuar agora.");
    } finally {
      setSending(false);
    }
  }

  function completeCurrentStep() {
    if (!challenge || currentStepIndex < 0) return;
    if (currentStepIndex === challenge.plan.length - 1) {
      setShowResultForm(true);
      return;
    }
    const plan = challenge.plan.map((step, index) => ({
      ...step,
      status: index === currentStepIndex ? "completed" as const : index === currentStepIndex + 1 ? "active" as const : step.status,
    }));
    persist({
      ...challenge,
      plan,
      messages: [...challenge.messages, newMessage("assistant", `Etapa concluída. Agora: ${plan[currentStepIndex + 1].outcome}`)],
      updatedAt: new Date().toISOString(),
    });
  }

  function completeChallenge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || result.trim().length < 5) return;
    persist({
      ...challenge,
      status: "completed",
      result: result.trim(),
      plan: challenge.plan.map((step) => ({ ...step, status: "completed" })),
      messages: [...challenge.messages, newMessage("user", `Resultado alcançado: ${result.trim()}`), newMessage("assistant", "Desafio concluído. Isso agora é uma capacidade sua — e pode ser reutilizada no próximo desafio.")],
      updatedAt: new Date().toISOString(),
    });
    setShowResultForm(false);
    setResult("");
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!challenge) {
    return (
      <div className="product-page min-h-screen">
        <ProductHeader />
        <main className="product-empty-state">
          <span className="product-kicker">Nenhum desafio aberto</span>
          <h1>O que você quer resolver?</h1>
          <Link href="/#novo" className="challenge-primary-button">Começar um desafio <ArrowRight className="size-4" /></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="product-page min-h-screen bg-white">
      <ProductHeader />
      <main className="challenge-workspace">
        <section className="challenge-conversation" aria-labelledby="conversation-title">
          <div className="challenge-panel-heading">
            <span>01</span><h2 id="conversation-title">Conversa</h2>
          </div>
          <div className="challenge-messages" aria-live="polite">
            {challenge.messages.map((item) => (
              <article key={item.id} className={`challenge-message challenge-message--${item.role}`}>
                <span>{item.role === "user" ? "Você" : "Saraiva.AI"}</span>
                {item.content.split("\n").map((paragraph, index) => paragraph ? <p key={index}>{paragraph}</p> : null)}
              </article>
            ))}
            {sending || challenge.status === "interpreting" ? (
              <div className="challenge-thinking"><LoaderCircle className="size-4 animate-spin" /> Pensando no próximo passo...</div>
            ) : null}
            <div ref={messagesEnd} />
          </div>

          <div className="challenge-composer">
            {challenge.status === "confirmation" ? (
              <div className="challenge-confirmation">
                <button type="button" className="challenge-primary-button" onClick={confirmInterpretation}>
                  Sim, é isso <Check className="size-4" />
                </button>
                <form onSubmit={submitCorrection}>
                  <label htmlFor="challenge-correction">Não exatamente. O que precisa mudar?</label>
                  <div><input id="challenge-correction" value={correction} onChange={(event) => setCorrection(event.target.value)} placeholder="Explique em uma frase..." maxLength={1_000} /><button type="submit" disabled={sending} aria-label="Enviar correção"><RotateCcw className="size-4" /></button></div>
                </form>
              </div>
            ) : challenge.status === "active" || challenge.status === "completed" ? (
              <form onSubmit={submitMessage}>
                <label htmlFor="challenge-message" className="sr-only">Continuar conversa</label>
                <textarea id="challenge-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={challenge.status === "completed" ? "Quer reutilizar ou melhorar este resultado?" : "Conte o que aconteceu ou peça ajuda para executar..."} rows={2} maxLength={3_000} />
                <button type="submit" disabled={sending || !message.trim()} aria-label="Enviar mensagem"><Send className="size-4" /></button>
              </form>
            ) : null}
            {error ? <p className="challenge-error" role="alert">{error}</p> : null}
          </div>
        </section>

        <section className="challenge-result" aria-labelledby="result-title">
          <div className="challenge-panel-heading">
            <span>02</span><h2 id="result-title">Resultado</h2>
          </div>
          <div className="challenge-canvas">
            <div className="challenge-canvas-top"><span>Artefato vivo</span><Sparkles className="size-4" /></div>
            <h3>{challenge.artifact.title}</h3>
            <div className="challenge-artifact-content"><MarkdownContent content={challenge.artifact.content} /></div>
          </div>
          {challenge.result ? (
            <div className="challenge-result-proof"><CheckCircle2 className="size-5" /><div><span>Resultado conquistado</span><p>{challenge.result}</p></div></div>
          ) : null}
        </section>

        <aside className="challenge-progress" aria-labelledby="progress-title">
          <div className="challenge-panel-heading">
            <span>03</span><h2 id="progress-title">Progresso</h2>
          </div>
          <div className="challenge-progress-body">
            <span className="product-kicker">Objetivo</span>
            <h1>{challenge.objective || challenge.title}</h1>
            <p>{challenge.expectedResult}</p>

            <div className="challenge-progress-meter"><span style={{ width: `${progress}%` }} /><b>{progress}%</b></div>
            <ol className="challenge-step-list">
              {challenge.plan.map((step, index) => (
                <li key={step.id} className={`challenge-step challenge-step--${step.status}`}>
                  {step.status === "completed" ? <CheckCircle2 /> : step.status === "active" ? <span>{index + 1}</span> : <Circle />}
                  <div><strong>{step.title}</strong><p>{step.outcome}</p></div>
                </li>
              ))}
            </ol>

            {challenge.status === "active" && currentStep ? (
              <button type="button" className="challenge-step-button" onClick={completeCurrentStep}>
                Concluir esta etapa <Check className="size-4" />
              </button>
            ) : challenge.status === "completed" ? (
              <Link href="/#novo" className="challenge-step-button">Resolver outro desafio <ArrowRight className="size-4" /></Link>
            ) : null}
          </div>
        </aside>
      </main>

      {showResultForm ? (
        <div className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="result-dialog-title">
          <form onSubmit={completeChallenge}>
            <span className="product-kicker">Última etapa</span>
            <h2 id="result-dialog-title">O que você efetivamente conseguiu?</h2>
            <p>Registre uma evidência concreta. Não precisa parecer grande — precisa ser verdadeira.</p>
            <textarea value={result} onChange={(event) => setResult(event.target.value)} placeholder="Ex.: publiquei a página e recebi o primeiro pedido de orçamento." rows={4} autoFocus maxLength={1_000} />
            <div><button type="button" onClick={() => setShowResultForm(false)}>Voltar</button><button type="submit" className="challenge-primary-button">Concluir desafio <Check className="size-4" /></button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="product-page min-h-screen">
      <ProductHeader />
      <main className="challenge-loading"><LoaderCircle className="size-6 animate-spin" /><p>Entendendo o que você realmente quer conseguir...</p></main>
    </div>
  );
}
