import { motion } from 'framer-motion'

const logos = [
  { name: 'ChatGPT', color: '#10A37F', icon: '🤖' },
  { name: 'Claude', color: '#D97706', icon: '🧠' },
  { name: 'Midjourney', color: '#7C3AED', icon: '🎨' },
  { name: 'Cursor', color: '#00D4FF', icon: '⌨️' },
  { name: 'Gemini', color: '#4285F4', icon: '💎' },
  { name: 'Perplexity', color: '#20B2AA', icon: '🔍' },
  { name: 'Notion AI', color: '#9CA3AF', icon: '📝' },
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
  speed = 35,
  direction = 'left',
  pauseOnHover = true,
}: LogosCarouselProps) {
  const duplicatedLogos = [...logos, ...logos]

  return (
    <div className="overflow-hidden">
      {/* Single row carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className={`flex gap-6 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
          animate={{
            x: direction === 'left' ? [0, -50 * logos.length] : [-50 * logos.length, 0],
          }}
          transition={{
            x: { duration: speed, repeat: Infinity, ease: 'linear' },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 group"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/50 border border-border/50 hover:border-border transition-colors duration-200">
                <span className="text-xl">{logo.icon}</span>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
