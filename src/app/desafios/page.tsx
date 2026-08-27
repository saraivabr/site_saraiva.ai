import type { Metadata } from "next";

import { ChallengeHistory } from "@/components/saraiva/challenge/ChallengeHistory";

export const metadata: Metadata = {
  title: "Meus desafios",
  robots: { index: false, follow: false },
};

export default function ChallengesPage() {
  return <ChallengeHistory />;
}
