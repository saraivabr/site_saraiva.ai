import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Política de Privacidade", alternates: { canonical: "/privacidade" } };

export default function PrivacyPage() {
  return <main className="min-h-screen bg-[var(--signal-paper)]"><article className="signal-shell max-w-3xl py-16"><Link href="/" className="signal-text-link">← Voltar</Link><p className="signal-kicker mt-12">Legal</p><h1 className="mt-4 text-5xl font-semibold tracking-[-.055em]">Política de Privacidade</h1><div className="prose-saraiva mt-10"><p>Esta política explica como a Saraiva.AI trata informações enviadas voluntariamente em formulários, diagnósticos, newsletter e canais de contato.</p><h2>Dados tratados</h2><p>Podemos tratar dados de contato, respostas fornecidas em diagnósticos, informações técnicas de navegação e dados necessários para atender solicitações.</p><h2>Finalidades</h2><p>Os dados são utilizados para responder contatos, entregar diagnósticos, melhorar a experiência, mensurar resultados e enviar comunicações autorizadas.</p><h2>Compartilhamento e segurança</h2><p>Não vendemos dados pessoais. O compartilhamento ocorre apenas com fornecedores necessários à operação, sob medidas de segurança e finalidade definida.</p><h2>Seus direitos</h2><p>Você pode solicitar acesso, correção, exclusão ou informações sobre o tratamento pelo WhatsApp oficial disponível no site.</p><h2>Atualizações</h2><p>Esta política pode ser atualizada para refletir mudanças legais ou operacionais. Última atualização: agosto de 2026.</p></div></article></main>;
}
