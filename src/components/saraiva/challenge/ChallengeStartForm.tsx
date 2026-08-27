"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PENDING_CHALLENGE_KEY } from "@/lib/challenges";

const examples = [
  "Quero conseguir meus primeiros clientes.",
  "Quero criar um aplicativo.",
  "Quero organizar meu negócio.",
];

export function ChallengeStartForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const challenge = value.trim();
    if (challenge.length < 5) {
      setError("Conte um pouco mais sobre o que você quer conseguir.");
      return;
    }
    window.sessionStorage.setItem(PENDING_CHALLENGE_KEY, challenge);
    router.push("/desafio");
  }

  return (
    <div className={compact ? "challenge-start challenge-start--compact" : "challenge-start"}>
      <form onSubmit={submit}>
        <label htmlFor={compact ? "challenge-footer" : "challenge-main"} className="sr-only">
          O que você quer resolver?
        </label>
        <div className="challenge-input-wrap">
          <span className="challenge-input-prefix" aria-hidden="true">Quero</span>
          <textarea
            id={compact ? "challenge-footer" : "challenge-main"}
            rows={compact ? 2 : 3}
            value={value}
            onChange={(event) => {
              setValue(event.target.value.replace(/^Quero\s*/i, ""));
              setError("");
            }}
            placeholder="conseguir meus primeiros clientes..."
            maxLength={2_000}
          />
        </div>
        <div className="challenge-form-footer">
          <span className="challenge-privacy">Seu desafio fica salvo neste dispositivo.</span>
          <button type="submit" className="challenge-primary-button">
            Resolver meu desafio <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700" role="alert">{error}</p> : null}
      </form>

      {!compact ? (
        <div className="challenge-examples" aria-label="Exemplos de desafios">
          <span>Experimente:</span>
          {examples.map((example) => (
            <button key={example} type="button" onClick={() => setValue(example.replace(/^Quero\s*/i, ""))}>
              {example}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
