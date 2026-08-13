import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialShell } from "@/components/saraiva/editorial/EditorialShell";
import { getPublicOfferBySlug } from "@/lib/catalog.server";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offer = await getPublicOfferBySlug((await params).slug);
  if (!offer) return {};
  return {
    title: offer.name,
    description: offer.problem,
    alternates: { canonical: `/solution/${offer.slug}` },
    openGraph: { title: offer.name, description: offer.problem, type: "website" },
  };
}

export default async function SolutionPage({ params }: Props) {
  const offer = await getPublicOfferBySlug((await params).slug);
  if (!offer) notFound();

  const whatsappUrl = `https://wa.me/5511988642668?text=${encodeURIComponent(`Quero conversar sobre a solução ${offer.name} da Saraiva.AI`)}`;

  return (
    <EditorialShell>
      <main>
        <section className="border-b border-[var(--signal-border)] bg-[var(--signal-ink)] text-white">
          <div className="signal-shell py-12 md:py-20">
            <Link href="/news" className="text-sm font-semibold text-white/55 transition-colors hover:text-[var(--signal-sky)]">← Voltar para o radar</Link>
            <div className="mt-12 grid gap-8 md:grid-cols-[180px_1fr]">
              <div>
                <p className="signal-kicker text-[var(--signal-sky)]">Solução em validação</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">{offer.public_status} · {offer.offer_type}</p>
              </div>
              <div>
                <h1 className="max-w-5xl text-[clamp(3.2rem,7vw,7.5rem)] font-semibold leading-[.84] tracking-[-0.07em]">{offer.name}</h1>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65">{offer.problem}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="signal-shell grid border-x border-[var(--signal-border)] md:grid-cols-2">
          <div className="border-b border-[var(--signal-border)] p-7 md:border-r md:p-12">
            <p className="signal-kicker">Para quem</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em]">Quem vive esse problema.</h2>
            <p className="mt-6 text-base leading-7 text-[var(--signal-muted)]">{offer.buyer}</p>
          </div>
          <div className="border-b border-[var(--signal-border)] p-7 md:p-12">
            <p className="signal-kicker">Como desenhamos</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em]">O que pode entrar na entrega.</h2>
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-[var(--signal-muted)]">{offer.delivery}</p>
          </div>
        </section>

        <section className="border-b border-[var(--signal-border)] bg-[var(--signal-blue)] text-white">
          <div className="signal-shell grid gap-8 py-14 md:grid-cols-[180px_1fr] md:py-20">
            <p className="signal-kicker pt-1 text-white/70">Próxima ação</p>
            <div>
              <h2 className="max-w-4xl text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[.9] tracking-[-0.06em]">Sua operação pode ajudar a validar isso.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75">Esta solução ainda está em validação. A conversa serve para entender aderência, limites e o que precisa ser provado antes de qualquer proposta.</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center bg-white px-6 text-sm font-bold text-[var(--signal-ink)] transition-colors hover:bg-[var(--signal-ink)] hover:text-white">Conversar sobre {offer.name} ↗</a>
            </div>
          </div>
        </section>
      </main>
    </EditorialShell>
  );
}
