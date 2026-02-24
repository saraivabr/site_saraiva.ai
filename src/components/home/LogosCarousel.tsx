import { motion } from 'framer-motion'

// AI Tools logos - ferramentas que cobrimos no saraiva.ai
const logos = [
  { name: 'ChatGPT', color: '#10A37F', icon: '🤖' },
  { name: 'Claude', color: '#D97706', icon: '🧠' },
  { name: 'Midjourney', color: '#7C3AED', icon: '🎨' },
  { name: 'Cursor', color: '#00D4FF', icon: '⌨️' },
  { name: 'Gemini', color: '#4285F4', icon: '💎' },
  { name: 'Perplexity', color: '#20B2AA', icon: '🔍' },
  { name: 'Notion AI', color: '#000000', icon: '📝' },
  { name: 'GitHub Copilot', color: '#6E40C9', icon: '👨‍💻' },
  { name: 'Stable Diffusion', color: '#FF6F61', icon: '🖼️' },
  { name: 'ElevenLabs', color: '#F59E0B', icon: '🎙️' },
  { name: 'Runway', color: '#EC4899', icon: '🎬' },
  { name: 'Whisper', color: '#22C55E', icon: '👂' },
]

interface LogosCarouselProps {
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export function LogosCarousel({
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
}: LogosCarouselProps) {
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos]

  return (
    <section className="py-20 bg-slate-950 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
          Ferramentas de IA
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
          Cobrimos as principais ferramentas
        </h2>
      </motion.div>

      {/* Carousel container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <motion.div
          className={`flex gap-8 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
          animate={{
            x: direction === 'left' ? [0, -50 * logos.length] : [-50 * logos.length, 0],
          }}
          transition={{
            x: {
              duration: speed,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <LogoItem key={`${logo.name}-${index}`} logo={logo} />
          ))}
        </motion.div>
      </div>

      {/* Second row going opposite direction */}
      <div className="relative mt-8">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <motion.div
          className={`flex gap-8 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
          animate={{
            x: direction === 'left' ? [-50 * logos.length, 0] : [0, -50 * logos.length],
          }}
          transition={{
            x: {
              duration: speed * 1.2,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {[...duplicatedLogos].reverse().map((logo, index) => (
            <LogoItem key={`${logo.name}-rev-${index}`} logo={logo} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

interface LogoItemProps {
  logo: { name: string; color: string; icon: string }
}

function LogoItem({ logo }: LogoItemProps) {
  return (
    <motion.div
      className="flex-shrink-0 group cursor-pointer"
      whileHover={{ scale: 1.1, y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div
        className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center gap-1 md:gap-2 transition-all duration-300 group-hover:border-slate-600"
        style={{
          boxShadow: `0 0 0 0 ${logo.color}20`,
        }}
      >
        {/* Icon */}
        <motion.div
          className="text-2xl md:text-4xl"
          animate={{ rotate: [0, 0] }}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          {logo.icon}
        </motion.div>

        {/* Name */}
        <span
          className="text-xs md:text-sm font-medium text-slate-400 group-hover:text-white transition-colors text-center px-1"
          style={{ color: undefined }}
        >
          {logo.name}
        </span>

        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${logo.color}15 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  )
}

// Alternative: Floating logos
export function FloatingLogos() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 relative z-10"
      >
        <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
          Tecnologias
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
          Stack moderna e poderosa
        </h2>
      </motion.div>

      <div className="relative h-64 max-w-4xl mx-auto">
        {logos.map((logo, index) => {
          const angle = (index / logos.length) * Math.PI * 2
          const radius = 120
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius * 0.5

          return (
            <motion.div
              key={logo.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ x, y, opacity: 0, scale: 0 }}
              whileInView={{
                x,
                opacity: 1,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: 'spring',
              }}
              animate={{
                y: [y - 10, y + 10, y - 10],
                transition: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <motion.div
                className="w-20 h-20 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer"
                whileHover={{
                  scale: 1.2,
                  borderColor: logo.color,
                  boxShadow: `0 0 30px ${logo.color}40`,
                }}
              >
                <span className="text-2xl">{logo.icon}</span>
                <span className="text-xs text-slate-400">{logo.name}</span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
