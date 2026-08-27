export type ChallengeStatus = "interpreting" | "confirmation" | "active" | "completed";

export type ChallengeStepStatus = "pending" | "active" | "completed";

export type ChallengeStep = {
  id: string;
  title: string;
  outcome: string;
  status: ChallengeStepStatus;
};

export type ChallengeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type Challenge = {
  id: string;
  originalInput: string;
  title: string;
  objective: string;
  expectedResult: string;
  interpretation: string;
  status: ChallengeStatus;
  plan: ChallengeStep[];
  messages: ChallengeMessage[];
  artifact: {
    title: string;
    content: string;
  };
  result: string;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
};

export type ChallengeInterpretation = {
  title: string;
  interpretation: string;
  objective: string;
  expectedResult: string;
  confirmationQuestion: string;
  plan: Array<{
    title: string;
    outcome: string;
  }>;
};

export type ChallengeResponse = {
  message: string;
  nextAction: string;
  artifactTitle: string;
  artifactContent: string;
  resultSignal: string;
  capabilitySignal: string;
};

const STORAGE_KEY = "saraiva.ai:challenges:v1";
export const PENDING_CHALLENGE_KEY = "saraiva.ai:pending-challenge";

export function loadChallenges(): Challenge[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isChallenge).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function saveChallenge(challenge: Challenge) {
  const challenges = loadChallenges();
  const next = [challenge, ...challenges.filter((item) => item.id !== challenge.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadChallenge(id: string) {
  return loadChallenges().find((challenge) => challenge.id === id) ?? null;
}

export function newMessage(role: ChallengeMessage["role"], content: string): ChallengeMessage {
  return {
    id: window.crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function isChallenge(value: unknown): value is Challenge {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Challenge>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.originalInput === "string" &&
    typeof candidate.updatedAt === "string" &&
    Array.isArray(candidate.plan) &&
    Array.isArray(candidate.messages)
  );
}
