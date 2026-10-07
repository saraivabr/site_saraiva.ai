import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./page.module.css";

type Props = { params: Promise<{ uid: string }> };

type Regravacao = {
  titulo?: string;
  tese?: string;
  mecanismo?: string[];
  hooks?: string[];
  roteiro_teleprompter?: string;
  mapa_gravacao?: Array<{
    tempo?: string;
    fala?: string;
    visual?: string;
    texto_tela?: string;
  }>;
  edicao?: string[];
  cta?: string;
  legenda?: string;
  checklist?: string[];
};

type ReelData = {
  uid: string;
  reel_url: string;
  creator: string;
  thumbnail_url: string;
  duration: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  followers: number | null;
  caption: string;
  transcript: string;
  analysis: string;
  regravacao: string;
  created_at: string;
};

const API_URL = "https://n8n.saraiva.ai/webhook/reel-transcricao";

async function getReel(uid: string): Promise<ReelData | null> {
  const response = await fetch(`${API_URL}?id=${encodeURIComponent(uid)}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  }).catch(() => null);

  if (!response?.ok) return null;

  const payload = (await response.json()) as { found?: boolean; data?: ReelData | null };
  return payload.found && payload.data ? payload.data : null;
}

function compactNumber(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function parseRegravacao(raw: string): Regravacao | null {
  try {
    const parsed = JSON.parse(raw) as Regravacao;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((fragment, index) => {
    if (fragment.startsWith("*") && fragment.endsWith("*") && fragment.length > 2) {
      return <strong key={index}>{fragment.slice(1, -1)}</strong>;
    }
    return fragment;
  });
}

function AnalysisText({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);
  return (
    <div className={styles.analysisText}>
      {blocks.map((block, index) => {
        const clean = block.trim();
        const lines = clean.split("\n");
        if (/^[^\p{L}\p{N}]*\*[^*]+\*$/u.test(lines[0] ?? "")) {
          return (
            <section key={index} className={styles.analysisBlock}>
              <h3>{inline(lines[0])}</h3>
              {lines.slice(1).map((line, lineIndex) => (
                <p key={lineIndex}>{inline(line)}</p>
              ))}
            </section>
          );
        }
        return (
          <p key={index} className={styles.analysisParagraph}>
            {inline(clean)}
          </p>
        );
      })}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const reel = await getReel(uid);
  return {
    title: reel ? `Regravação @${reel.creator}` : "Regravação de Reel",
    description: "Raio-X de Reel e plano de regravação adaptado para Saraiva.AI.",
    robots: { index: false, follow: false },
  };
}

export default async function TranscricaoPage({ params }: Props) {
  const { uid } = await params;
  const reel = await getReel(uid);
  if (!reel) notFound();

  const plan = parseRegravacao(reel.regravacao);
  const duration = reel.duration == null ? "—" : `${Math.round(reel.duration)}s`;

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}>SARAIVA<span>.AI</span></a>
        <span className={styles.lab}>REEL LAB / REGRAVAÇÃO</span>
        <a href={reel.reel_url} target="_blank" rel="noreferrer" className={styles.originalLink}>
          abrir original ↗
        </a>
      </header>

      <section className={styles.hero}>
        <div
          className={styles.poster}
          style={{ backgroundImage: `url("${reel.thumbnail_url}")` }}
          aria-label={`Capa do Reel de @${reel.creator}`}
        >
          <div className={styles.posterBadge}>ORIGINAL</div>
        </div>

        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>DECODIFICADO PARA REGRAVAR</span>
          <h1>{plan?.titulo || "Um Reel desmontado até virar roteiro."}</h1>
          <p className={styles.heroIntro}>
            A ideia aqui não é copiar o vídeo. É capturar o mecanismo que fez ele funcionar e reconstruí-lo com a voz, o contexto e a autoridade da Saraiva.AI.
          </p>

          <div className={styles.metrics}>
            <div><strong>{compactNumber(reel.views)}</strong><span>views</span></div>
            <div><strong>{compactNumber(reel.likes)}</strong><span>likes</span></div>
            <div><strong>{compactNumber(reel.comments)}</strong><span>comentários</span></div>
            <div><strong>{duration}</strong><span>duração</span></div>
          </div>

          <div className={styles.sourceLine}>
            <span>@{reel.creator}</span>
            <span>•</span>
            <span>{compactNumber(reel.followers)} seguidores</span>
            <span>•</span>
            <span>ID {reel.uid.slice(0, 8)}</span>
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <aside className={styles.stickyIndex}>
          <span className={styles.indexLabel}>NESTA FICHA</span>
          <a href="#tese">01. Tese Saraiva</a>
          <a href="#hooks">02. Hooks</a>
          <a href="#roteiro">03. Teleprompter</a>
          <a href="#gravacao">04. Mapa de gravação</a>
          <a href="#edicao">05. Edição + CTA</a>
          <a href="#raiox">06. Raio-X original</a>
          <a href="#transcricao">07. Transcrição</a>
        </aside>

        <div className={styles.content}>
          <section id="tese" className={styles.section}>
            <div className={styles.sectionHead}><span>01</span><h2>O que vira Saraiva.</h2></div>
            <div className={styles.callout}>
              <span>TESE</span>
              <p>{plan?.tese || "Usar o mecanismo do Reel como molde de atenção, trocando tema, prova, linguagem e CTA pela realidade da Saraiva.AI."}</p>
            </div>
            {plan?.mecanismo?.length ? (
              <div className={styles.chips}>
                {plan.mecanismo.map((item) => <span key={item}>{item}</span>)}
              </div>
            ) : null}
          </section>

          <section id="hooks" className={styles.section}>
            <div className={styles.sectionHead}><span>02</span><h2>3 maneiras de abrir.</h2></div>
            <div className={styles.hookGrid}>
              {(plan?.hooks?.length ? plan.hooks : ["Transforme o mecanismo original em uma abertura que pareça descoberta, não anúncio."]).map((hook, index) => (
                <article key={hook} className={styles.hookCard}>
                  <span>HOOK 0{index + 1}</span>
                  <p>“{hook}”</p>
                </article>
              ))}
            </div>
          </section>

          <section id="roteiro" className={styles.section}>
            <div className={styles.sectionHead}><span>03</span><h2>Teleprompter pronto.</h2></div>
            <div className={styles.teleprompter}>
              <span>FALA FINAL</span>
              <p>{plan?.roteiro_teleprompter || "O roteiro adaptado aparecerá aqui assim que a automação gerar a versão Saraiva."}</p>
            </div>
          </section>

          <section id="gravacao" className={styles.section}>
            <div className={styles.sectionHead}><span>04</span><h2>Mapa de gravação.</h2></div>
            <div className={styles.shotList}>
              {(plan?.mapa_gravacao || []).map((shot, index) => (
                <article key={`${shot.tempo}-${index}`} className={styles.shot}>
                  <div className={styles.shotTime}>{shot.tempo || `BLOCO ${index + 1}`}</div>
                  <div>
                    <strong>FALA</strong>
                    <p>{shot.fala || "—"}</p>
                  </div>
                  <div>
                    <strong>VISUAL</strong>
                    <p>{shot.visual || "—"}</p>
                  </div>
                  <div>
                    <strong>TEXTO NA TELA</strong>
                    <p>{shot.texto_tela || "—"}</p>
                  </div>
                </article>
              ))}
              {!plan?.mapa_gravacao?.length ? <p className={styles.muted}>O mapa visual será preenchido automaticamente nos próximos Reels.</p> : null}
            </div>
          </section>

          <section id="edicao" className={styles.section}>
            <div className={styles.sectionHead}><span>05</span><h2>Acabamento para publicar.</h2></div>
            <div className={styles.twoCols}>
              <div className={styles.panel}>
                <span>EDIÇÃO</span>
                <ul>{(plan?.edicao || []).map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className={styles.panel}>
                <span>CTA</span>
                <p className={styles.cta}>{plan?.cta || "CTA a definir."}</p>
                <span className={styles.subLabel}>LEGENDA</span>
                <p>{plan?.legenda || "Legenda a definir."}</p>
              </div>
            </div>
            {plan?.checklist?.length ? (
              <div className={styles.checklist}>
                {plan.checklist.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}
              </div>
            ) : null}
          </section>

          <section id="raiox" className={styles.section}>
            <div className={styles.sectionHead}><span>06</span><h2>Por que o original funciona.</h2></div>
            <div className={styles.paper}><AnalysisText content={reel.analysis} /></div>
          </section>

          <section id="transcricao" className={styles.section}>
            <div className={styles.sectionHead}><span>07</span><h2>Transcrição original.</h2></div>
            <div className={styles.transcript}>
              <span>AUDIO → TEXTO</span>
              <p>{reel.transcript}</p>
            </div>
            <details className={styles.caption}>
              <summary>Ver legenda original do post</summary>
              <p>{reel.caption}</p>
            </details>
          </section>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>SARAIVA.AI / REEL LAB</span>
        <span>Copiar o mecanismo. Não o conteúdo.</span>
      </footer>
    </main>
  );
}
