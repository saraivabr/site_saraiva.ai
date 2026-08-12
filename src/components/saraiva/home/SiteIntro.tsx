"use client";

import { useEffect, useState } from "react";

const INTRO_KEY = "saraiva-ai-intro-2026";
const LETTERS = Array.from("saraiva.ai");

type IntroPhase = "checking" | "enter" | "exit" | "curtain" | "done";

export function SiteIntro() {
  const [phase, setPhase] = useState<IntroPhase>("checking");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem(INTRO_KEY)) {
      const skipTimer = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skipTimer);
    }

    window.sessionStorage.setItem(INTRO_KEY, "seen");
    const timers = [
      window.setTimeout(() => setPhase("enter"), 40),
      window.setTimeout(() => setPhase("exit"), 900),
      window.setTimeout(() => setPhase("curtain"), 1080),
      window.setTimeout(() => setPhase("done"), 1840),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`signal-intro signal-intro--${phase}`} aria-hidden="true">
      <div className="signal-intro__curtain" />
      <div className="signal-intro__word" role="presentation">
        {LETTERS.map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ "--intro-index": index } as React.CSSProperties}>
            {letter}
          </span>
        ))}
      </div>
      <div className="signal-intro__rule" />
    </div>
  );
}
