import Image from "next/image";

type NewsVisualFamily = "creative" | "future" | "growth" | "story" | "tools" | "truth";

const FAMILY_ASSETS: Record<NewsVisualFamily, string> = {
  creative: "/news/brand-system/editorial-creative-v1.png",
  future: "/news/brand-system/editorial-future-v1.png",
  growth: "/news/brand-system/editorial-growth-v1.png",
  story: "/news/brand-system/editorial-story-v1.png",
  tools: "/news/brand-system/editorial-tools-v1.png",
  truth: "/news/brand-system/editorial-truth-v1.png",
};

const FAMILY_LABELS: Record<NewsVisualFamily, string> = {
  creative: "Criatividade",
  future: "Futuro",
  growth: "Crescimento",
  story: "Histórias reais",
  tools: "Ferramentas",
  truth: "Sinal e ruído",
};

const KEYWORDS: Array<[NewsVisualFamily, RegExp]> = [
  ["story", /quase|quebrei|erro|fracass|aprendi|hist[oó]ria|jornada|decis[aã]o|recome|medo|dif[ií]cil/i],
  ["truth", /verdade|aten[cç][aã]o|not[ií]cia|m[ií]dia|fake|colapso|informa[cç][aã]o|risco|crise/i],
  ["growth", /vend|renda|dinheiro|lucro|neg[oó]cio|linkedin|carreira|mercado|cliente|empresa|empreend|b2b/i],
  ["creative", /v[ií]deo|imagem|document[aá]rio|conte[uú]do|criativ|design|c[aâ]mera|roteiro|instagram|youtube|arte/i],
  ["future", /sa[uú]de|futuro|2026|educa|ci[eê]ncia|sociedade|humano|longevidade|trabalho|mundo/i],
  ["tools", /prompt|ferramenta|sistema|agente|automat|site|c[oó]digo|workflow|produtiv|app|ia\b/i],
];

export function newsVisualFamily(title: string): NewsVisualFamily {
  return KEYWORDS.find(([, pattern]) => pattern.test(title))?.[0] ?? "truth";
}

export function NewsArt({ title, priority = false }: { title: string; priority?: boolean }) {
  const family = newsVisualFamily(title);

  return (
    <div className="relative aspect-video overflow-hidden bg-[#14171C]" data-news-family={family}>
      <Image
        src={FAMILY_ASSETS[family]}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d] via-[#080a0d]/70 to-transparent" />
      <div className="absolute inset-0 flex max-w-[62%] flex-col justify-between p-[5%] text-white">
        <div className="flex items-center gap-2 text-[clamp(7px,0.72vw,11px)] font-bold uppercase tracking-[0.18em] text-[#4DCFFB]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#206FF6]" />
          Saraiva.AI News · {FAMILY_LABELS[family]}
        </div>
        <p className="line-clamp-4 text-[clamp(13px,1.75vw,28px)] font-bold leading-[1.02] tracking-[-0.045em] text-[#FBFBFB]">
          {title}
        </p>
      </div>
    </div>
  );
}
