import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  icon: React.ReactNode
  cta: string
  ctaLink: string
}

const tiers: PricingTier[] = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Acesso à biblioteca básica de recursos',
    icon: <Sparkles className="w-5 h-5" />,
    features: [
      'Acesso aos prompts públicos',
      'Ferramentas básicas',
      '5 downloads/mês',
      'Suporte da comunidade',
    ],
    cta: 'Começar grátis',
    ctaLink: '/explore',
  },
  {
    name: 'Pro',
    price: 'R$ 47',
    period: '/mês',
    description: 'Para criadores e profissionais',
    icon: <Zap className="w-5 h-5" />,
    highlighted: true,
    features: [
      'Tudo do plano Gratuito',
      'Acesso completo à biblioteca',
      'Downloads ilimitados',
      'Templates exclusivos',
      'MCPs premium',
      'Suporte prioritário',
      'Atualizações semanais',
    ],
    cta: 'Assinar Pro',
    ctaLink: 'https://wa.me/5511999999999?text=Quero%20assinar%20o%20plano%20Pro',
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Para times e empresas',
    icon: <Crown className="w-5 h-5" />,
    features: [
      'Tudo do plano Pro',
      'Licença para equipe',
      'Consultoria personalizada',
      'Implementação assistida',
      'SLA dedicado',
      'Treinamento da equipe',
    ],
    cta: 'Falar com vendas',
    ctaLink: 'https://wa.me/5511999999999?text=Quero%20saber%20sobre%20o%20plano%20Enterprise',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function PricingSection() {
  return (
    <section className="py-24" id="pricing">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Planos flexíveis
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Escolha seu plano
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acesse a maior biblioteca curada de recursos de IA do Brasil
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease }}
              className={`relative rounded-2xl p-6 md:p-7 transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-accent/10 to-card border-2 border-accent/30 shadow-xl shadow-accent/5 md:-mt-2 md:mb-2'
                  : 'bg-card/60 border border-border/50 hover:border-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                  Mais popular
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`p-2 rounded-lg ${tier.highlighted ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                  {tier.icon}
                </div>
                <h3 className="text-lg font-bold font-display">{tier.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="text-3xl font-bold font-display">{tier.price}</span>
                <span className="text-muted-foreground text-sm">{tier.period}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-accent' : 'text-primary/70'}`} />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaLink.startsWith('http') ? (
                <a
                  href={tier.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center text-sm transition-all duration-200 ${
                    tier.highlighted
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  to={tier.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center text-sm transition-all duration-200 ${
                    tier.highlighted
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tier.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground mb-3">
            Pagamento seguro · Cancele quando quiser · Garantia de 7 dias
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-muted-foreground text-xs">
            {['SSL Seguro', 'Suporte em português', 'Pix, cartão ou boleto'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
