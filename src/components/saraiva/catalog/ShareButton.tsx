"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  name: string;
  path: string;
}

export function ShareButton({ name, path }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({ title: name, text: name, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-4 text-sm font-semibold tracking-tight text-white transition-transform hover:scale-[1.02] md:py-5"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Share2 aria-hidden="true" className="size-4" />
      )}
      {copied ? "Link copiado!" : "Compartilhar"}
    </button>
  );
}
