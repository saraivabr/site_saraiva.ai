import { motion } from 'framer-motion'
import { AnimatedIcon } from './AnimatedIcon'

interface Feature {
  icon: string
  title: string
  description: string
  gradient: string
  animation: 'pulse' | 'bounce' | 'rotate' | 'shake' | 'float' | 'glow'
}

const features: Feature[] = [
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Inteligência artificial de ponta para automatizar e otimizar seus processos.',
    gradient: 'from-violet-500 to-purple-500',
    animation: 'float',
  },
  {
    icon: '⚡',
    title: 'Ultra Rápido',
    description: 'Performance excepcional com tempos de resposta instantâneos.',
    gradient: 'from-amber-500 to-orange-500',
    animation: 'bounce',
  },
  {
    icon: '🔒',
    title: 'Seguro',
    description: 'Segurança enterprise-grade com criptografia de ponta a ponta.',
    gradient: 'from-emerald-500 to-green-500',
    animation: 'pulse',
  },
  {
    icon: '📈',
    title: 'Escalável',
    description: 'Infraestrutura que cresce junto com seu negócio, sem limites.',
    gradient: 'from-blue-500 to-cyan-500',
    animation: 'glow',
  },
  {
    icon: '🎨',
    title: 'Moderno',
    description: 'Design contemporâneo e interface intuitiva que encanta usuários.',
    gradient: 'from-pink-500 to-rose-500',
    animation: 'rotate',
  },
  {
    icon: '✨',
    title: 'Confiável',
    description: '99.9% de uptime garantido com suporte técnico especializado.',
    gradient: 'from-indigo-500 to-blue-500',
    animation: 'shake',
  },
]

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Por que nos escolher?
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recursos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              poderosos
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tudo o que você precisa para transformar suas ideias em produtos digitais de sucesso.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full"
                whileHover={{
                  y: -5,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Gradient glow on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <AnimatedIcon
                    animation={feature.animation}
                    color={feature.gradient}
                    size="lg"
                    className="mb-6"
                  >
                    {feature.icon}
                  </AnimatedIcon>

                  <motion.h3
                    className="text-xl font-bold text-white mb-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>
                      Saiba mais
                    </span>
                    <motion.span
                      className="text-indigo-400"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>

                {/* Corner decoration */}
                <div
                  className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore todos os recursos
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
