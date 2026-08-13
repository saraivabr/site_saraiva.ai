import Image from "next/image";

type NewsVisualFamily = "creative" | "future" | "growth" | "story" | "tools" | "truth";

const FAMILY_ASSETS: Record<NewsVisualFamily, string> = {
  creative: "/news/saraiva-creative-v1.webp",
  future: "/news/saraiva-future-v1.webp",
  growth: "/news/saraiva-growth-v1.webp",
  story: "/news/saraiva-story-v1.webp",
  tools: "/news/saraiva-tools-v1.webp",
  truth: "/news/saraiva-truth-v1.webp",
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

export function NewsArt({ title, image, priority = false }: { title: string; image?: string | null; priority?: boolean }) {
  const family = newsVisualFamily(title);
  const issue = String([...title].reduce((total, character) => total + character.charCodeAt(0), 0) % 100).padStart(2, "0");
  const safeImage = image?.startsWith("/images/news/") ? image : null;

  return (
    <div className={`news-art news-art--${family} relative aspect-video overflow-hidden bg-[var(--signal-paper)]`} data-news-family={family}>
      <Image
        src={safeImage || FAMILY_ASSETS[family]}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className={`absolute inset-y-0 left-0 w-[61%] ${safeImage ? "bg-[linear-gradient(90deg,rgba(17,19,21,.94)_0%,rgba(17,19,21,.76)_72%,rgba(17,19,21,0)_100%)]" : "bg-[linear-gradient(90deg,rgba(243,241,234,.98)_0%,rgba(243,241,234,.95)_72%,rgba(243,241,234,0)_100%)]"}`} />
      <div aria-hidden="true" className="news-art__signal absolute left-0 top-0 h-2 w-[42%] bg-[var(--signal-blue)]" />
      <div className={`absolute inset-0 flex max-w-[61%] flex-col justify-between p-[5%] ${safeImage ? "text-white" : "text-[var(--signal-ink)]"}`}>
        <div className="flex items-center justify-between gap-3 font-mono text-[clamp(7px,0.7vw,10px)] font-bold uppercase tracking-[0.16em] text-[var(--signal-blue)]">
          <span>Saraiva.AI · {FAMILY_LABELS[family]}</span><span>#{issue}</span>
        </div>
        <p className="line-clamp-4 text-[clamp(14px,1.8vw,30px)] font-semibold leading-[.96] tracking-[-0.055em]">
          {title}
        </p>
        <p className={`font-mono text-[clamp(6px,.6vw,9px)] uppercase tracking-[.15em] ${safeImage ? "text-white/65" : "text-[var(--signal-muted)]"}`}>Sinal para quem precisa decidir</p>
      </div>
    </div>
  );
}
