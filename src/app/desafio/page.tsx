import type { Metadata } from "next";
import { Suspense } from "react";

import { ChallengeWorkspace } from "@/components/saraiva/challenge/ChallengeWorkspace";

export const metadata: Metadata = {
  title: "Resolver desafio",
  robots: { index: false, follow: false },
};

export default function ChallengePage() {
  return <Suspense fallback={null}><ChallengeWorkspace /></Suspense>;
}
