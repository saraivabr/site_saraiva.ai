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
    icon: <Sparkles className="w-6 h-6" />,
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
    icon: <Zap className="w-6 h-6" />,
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
    icon: <Crown className="w-6 h-6" />,
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

export function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            Planos flexíveis
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha seu plano
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acesse a maior biblioteca curada de recursos de IA do Brasil
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-2">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 ${
                tier.highlighted
                  ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 md:scale-105 z-10'
                  : 'bg-card border border-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 text-yellow-950 text-sm font-bold rounded-full">
                  Mais popular
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${tier.highlighted ? 'bg-white/20' : 'bg-primary/10'}`}>
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold">{tier.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={tier.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                  {tier.period}
                </span>
              </div>

              {/* Description */}
              <p className={`mb-6 ${tier.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-primary'}`} />
                    <span className={tier.highlighted ? 'text-primary-foreground/90' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.ctaLink.startsWith('http') ? (
                <a
                  href={tier.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${
                    tier.highlighted
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  to={tier.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${
                    tier.highlighted
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
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
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Pagamento seguro • Cancele quando quiser • Garantia de 7 dias
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-muted-foreground text-sm">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              SSL Seguro
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Suporte em português
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Pix, cartão ou boleto
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
