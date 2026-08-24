import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Termos de Uso", alternates: { canonical: "/termos" } };

export default function TermsPage() {
  return <main className="min-h-screen bg-[var(--signal-paper)]"><article className="signal-shell max-w-3xl py-16"><Link href="/" className="signal-text-link">← Voltar</Link><p className="signal-kicker mt-12">Legal</p><h1 className="mt-4 text-5xl font-semibold tracking-[-.055em]">Termos de Uso</h1><div className="prose-saraiva mt-10"><p>Ao acessar a Saraiva.AI, você concorda em utilizar o conteúdo e as funcionalidades de forma lícita e responsável.</p><h2>Conteúdo e ferramentas</h2><p>Análises, catálogos e diagnósticos possuem caráter informativo e não substituem avaliação profissional específica. Ferramentas de terceiros seguem seus próprios termos.</p><h2>Propriedade intelectual</h2><p>A identidade, os conteúdos autorais e os materiais da Saraiva.AI não podem ser reproduzidos comercialmente sem autorização.</p><h2>Disponibilidade</h2><p>Funcionalidades podem ser alteradas, suspensas ou atualizadas para manutenção, segurança ou evolução do serviço.</p><h2>Responsabilidade</h2><p>Decisões tomadas a partir do conteúdo são de responsabilidade do usuário. Projetos contratados são regidos por proposta e contrato próprios.</p><h2>Contato</h2><p>Dúvidas podem ser enviadas pelo WhatsApp oficial disponível no site. Última atualização: agosto de 2026.</p></div></article></main>;
}
