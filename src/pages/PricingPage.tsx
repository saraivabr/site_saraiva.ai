import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Sparkles, Zap, Crown, Users, ChevronDown,
  Search, Layers, Copy, Globe, Rocket, Shield, Star,
  QrCode, Loader2, AlertCircle, X as XIcon,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCheckout";

// ─── Types ───────────────────────────────────────────────
type Plan = "pro" | "teams";

interface PricingTier {
  id: "free" | "pro" | "teams";
  name: string;
  price: string;
  period: string;
  description: string;
  icon: any;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaStyle: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Data ────────────────────────────────────────────────
const tiers: PricingTier[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "R$0",
    period: "para sempre",
    description: "Explore todo o diretório sem limites. Perfeito para quem está começando.",
    icon: Zap,
    features: [
      "Navegação completa do diretório (1.552 itens)",
      "Busca, filtros e categorias",
      "Stack Builder com cópia de comandos",
      "Páginas de detalhe completas",
    ],
    cta: "Começar grátis",
    ctaStyle:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20",
  },
  {
    id: "pro",
    name: "Saraiva Pro",
    price: "R$29",
    period: "/mês",
    description: "Para desenvolvedores que querem produtividade máxima com curadoria e automação.",
    icon: Crown,
    highlighted: true,
    badge: "Mais popular",
    features: [
      "Tudo do Gratuito",
      "Stacks salvos na conta",
      "Instalação one-click",
      "Curadoria personalizada",
      "Traduções pt-br profissionais",
      "Acesso antecipado a novos itens",
      "Badge \"Pro\" no perfil",
    ],
    cta: "Assinar com Pix",
    ctaStyle:
      "bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 shadow-lg shadow-amber-400/25",
  },
  {
    id: "teams",
    name: "Saraiva Teams",
    price: "R$79",
    period: "/mês",
    description: "Para times que precisam de colaboração, padronização e suporte dedicado.",
    icon: Users,
    features: [
      "Tudo do Pro",
      "Stacks compartilhados com o time",
      "Dashboard de uso e métricas",
      "Configurações pré-montadas por projeto",
      "Suporte prioritário",
    ],
    cta: "Assinar com Pix",
    ctaStyle:
      "bg-white text-[#0a0a0a] hover:bg-white/90 shadow-lg shadow-white/10",
  },
];

const faqs: FaqItem[] = [
  {
    question: "O que é o Saraiva.AI?",
    answer:
      "Saraiva.AI é a maior livraria curada de componentes para Claude Code em português. Reunimos skills, agents, MCPs, comandos, hooks e settings — tudo organizado, traduzido e pronto para usar.",
  },
  {
    question: "Posso usar o plano gratuito sem cadastro?",
    answer:
      "Sim! O diretório completo, busca, filtros e o Stack Builder estão disponíveis para todos sem necessidade de criar conta. Você só precisa de uma conta para salvar stacks e acessar recursos Pro.",
  },
  {
    question: "Como funciona o pagamento via Pix?",
    answer:
      "Usamos a plataforma Woovi para processar pagamentos instantâneos via Pix. Após a confirmação (geralmente em segundos), seu acesso Pro ou Teams é ativado automaticamente. Sem cartão de crédito necessário.",
  },
  {
    question: "Posso cancelar a assinatura a qualquer momento?",
    answer:
      "Sim, sem multa e sem burocracia. Você pode cancelar direto no painel da sua conta. O acesso continua ativo até o final do período já pago.",
  },
  {
    question: "O que são \"Stacks\" e como funcionam?",
    answer:
      "Stacks são coleções personalizadas de skills, agents, MCPs e outros componentes que você monta para seu projeto. No plano gratuito você pode montar e copiar comandos. No Pro, seus stacks ficam salvos na nuvem e podem ser instalados com um clique.",
  },
];

// ─── Component ───────────────────────────────────────────
const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isLoggedIn, login } = useAuth();
  const { checkout, loading: checkoutLoading, result: checkoutResult, error: checkoutError, reset: resetCheckout } = useCheckout();

  const handleSubscribe = (plan: Plan) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    checkout(plan);
  };

  return (
    <>
      <SEOHead title="Planos e Preços" description="Escolha o melhor plano para maximizar sua produtividade com Claude Code. Comece grátis ou evolua para Pro." path="/pricing" />

      {/* ─── DARK HERO HEADER ─── */}
      <section className="relative bg-[var(--color-surface-0)] pt-32 pb-20 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,204,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Yellow glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/8 rounded-full blur-[150px]" />

        <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-sm font-medium text-amber-400 mb-8">
              <Sparkles className="w-4 h-4" />
              Preços simples, sem surpresas
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight text-white leading-[0.95] mb-5">
              Escolha seu plano
              <span className="text-amber-400">.</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Comece grátis com acesso completo ao diretório. Evolua para Pro
              quando quiser mais produtividade e automação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING CARDS ─── */}
      <section className="relative -mt-8 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const isHighlighted = tier.highlighted;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isHighlighted
                      ? "bg-[var(--color-surface-0)] border-2 border-amber-400/50 shadow-2xl shadow-amber-400/10 md:-mt-4 md:mb-[-16px]"
                      : "bg-[var(--color-surface-1)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-black/5"
                  }`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute top-0 left-0 right-0">
                      <div className="flex justify-center -mt-px">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-400 text-[#0a0a0a] text-xs font-bold rounded-b-lg">
                          <Star className="w-3 h-3" />
                          {tier.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className={`p-7 ${tier.badge ? "pt-10" : ""}`}>
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isHighlighted
                            ? "bg-amber-400 shadow-md shadow-amber-400/20"
                            : "bg-[var(--color-surface-2)] border border-[var(--color-border)]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isHighlighted ? "text-[#0a0a0a]" : "text-[var(--color-text-secondary)]"
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-bold ${
                          isHighlighted ? "text-white" : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {tier.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span
                        className={`text-4xl font-extrabold tracking-tight ${
                          isHighlighted ? "text-white" : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {tier.price}
                      </span>
                      <span
                        className={`text-sm ml-1 ${
                          isHighlighted ? "text-white/40" : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {tier.period}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-sm leading-relaxed mb-7 ${
                        isHighlighted ? "text-white/50" : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {tier.description}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        if (tier.id === "pro" || tier.id === "teams") {
                          handleSubscribe(tier.id);
                        }
                      }}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${tier.ctaStyle}`}
                    >
                      {tier.cta}
                    </button>

                    {/* Divider */}
                    <div
                      className={`my-7 h-px ${
                        isHighlighted ? "bg-white/10" : "bg-border"
                      }`}
                    />

                    {/* Features */}
                    <ul className="space-y-3.5">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              isHighlighted
                                ? "bg-amber-400/15"
                                : "bg-[var(--color-surface-2)]"
                            }`}
                          >
                            <Check
                              className={`w-3 h-3 ${
                                isHighlighted
                                  ? "text-amber-400"
                                  : "text-[var(--color-text-tertiary)]"
                              }`}
                              strokeWidth={3}
                            />
                          </div>
                          <span
                            className={`text-sm leading-relaxed ${
                              isHighlighted
                                ? "text-white/70"
                                : "text-[var(--color-text-secondary)]"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pix Payment Modal */}
      <AnimatePresence>
        {(checkoutResult || checkoutLoading || checkoutError) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetCheckout}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50 bg-[var(--color-surface-1)] rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Pagamento via Pix</h3>
                  <button
                    onClick={resetCheckout}
                    className="p-2 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                </div>

                {checkoutLoading && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[var(--color-text-secondary)]">Gerando QR Code Pix...</p>
                  </div>
                )}

                {checkoutError && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Erro ao gerar pagamento</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-6">{checkoutError}</p>
                    <button
                      onClick={resetCheckout}
                      className="px-6 py-2.5 rounded-xl bg-[var(--color-surface-3)] text-white text-sm font-medium hover:bg-[var(--color-surface-3)] transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {checkoutResult && (
                  <div className="text-center">
                    {checkoutResult.qrCode && (
                      <div className="mb-6">
                        <div className="w-56 h-56 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/30 bg-white p-2">
                          <img
                            src={checkoutResult.qrCode}
                            alt="QR Code Pix"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Escaneie o QR Code com seu banco
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-6">
                      Aguardando confirmação do pagamento...
                    </p>

                    {checkoutResult.brCode && (
                      <div className="mb-4">
                        <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                          Ou copie o código Pix
                        </p>
                        <div className="relative">
                          <input
                            readOnly
                            value={checkoutResult.brCode}
                            className="w-full px-4 py-3 pr-20 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] truncate"
                          />
                          <button
                            onClick={() => navigator.clipboard.writeText(checkoutResult.brCode)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-amber-400 text-[#0a0a0a] text-xs font-semibold hover:bg-amber-300 transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-medium text-amber-700">
                        Aguardando pagamento...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── TRUST STRIP ─── */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Search, label: "1.552 itens", sub: "no diretório" },
              { icon: Globe, label: "100% pt-br", sub: "traduções curadas" },
              { icon: Rocket, label: "Pix instantâneo", sub: "via Woovi" },
              { icon: Shield, label: "Cancele quando", sub: "quiser, sem multa" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight mb-3">
              Perguntas frequentes
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Tudo que você precisa saber sobre o Saraiva.AI e os planos.
            </p>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    <span className="text-sm font-semibold text-[var(--color-text-primary)] pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative bg-[var(--color-surface-0)] py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,204,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,204,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Pronto para montar seu stack?
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Comece explorando o diretório gratuitamente. Quando precisar de mais,
            o Pro está a um Pix de distância.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/directory/skills"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#0a0a0a] font-semibold text-sm hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              Explorar diretório
            </a>
            <button
              onClick={() => handleSubscribe("pro")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 text-[#0a0a0a] font-semibold text-sm hover:bg-amber-300 transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/20"
            >
              <Crown className="w-4 h-4" />
              Assinar Pro com Pix
            </button>
          </div>
        </motion.div>
      </section>

    </>
  );
};

export default PricingPage;
