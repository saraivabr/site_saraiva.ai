import type { Metadata } from "next";

import { CapabilityProfile } from "@/components/saraiva/challenge/CapabilityProfile";

export const metadata: Metadata = {
  title: "Suas capacidades",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <CapabilityProfile />;
}
