import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Mesh gradient orbs — slow, organic movement */}
      <motion.div
        className="absolute -top-1/3 -left-1/4 w-[60%] h-[60%] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, hsl(270 60% 50% / 0.25) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[55%] h-[55%] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(38 92% 50% / 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[40%] h-[40%] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(270 80% 65% / 0.2) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Subtle noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
