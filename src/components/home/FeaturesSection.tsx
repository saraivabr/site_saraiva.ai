import { motion } from 'framer-motion'
import { Cpu, Zap, Shield, TrendingUp, Palette, Award } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered',
    description: 'Inteligência artificial de ponta para automatizar e otimizar seus processos.',
    accent: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/10',
  },
  {
    icon: Zap,
    title: 'Ultra Rápido',
    description: 'Performance excepcional com tempos de resposta instantâneos.',
    accent: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
  {
    icon: Shield,
    title: 'Seguro',
    description: 'Segurança enterprise-grade com criptografia de ponta a ponta.',
    accent: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Escalável',
    description: 'Infraestrutura que cresce junto com seu negócio, sem limites.',
    accent: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/10',
  },
  {
    icon: Palette,
    title: 'Moderno',
    description: 'Design contemporâneo e interface intuitiva que encanta usuários.',
    accent: 'text-pink-400',
    glow: 'group-hover:shadow-pink-500/10',
  },
  {
    icon: Award,
    title: 'Confiável',
    description: '99.9% de uptime garantido com suporte técnico especializado.',
    accent: 'text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/10',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function FeaturesSection() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className={`group relative p-6 rounded-2xl bg-card/60 border border-border/50 hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.glow}`}
        >
          <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 ${feature.accent}`}>
            <feature.icon className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-semibold font-display text-foreground mb-2">
            {feature.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
