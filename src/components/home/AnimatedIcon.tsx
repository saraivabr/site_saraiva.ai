import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimationType = 'pulse' | 'bounce' | 'rotate' | 'shake' | 'float' | 'glow'

interface AnimatedIconProps {
  children: ReactNode
  animation?: AnimationType
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  hoverOnly?: boolean
}

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-3xl',
}

const animations: Record<AnimationType, Variants> = {
  pulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    hover: { scale: 1.2 },
  },
  bounce: {
    initial: { y: 0 },
    animate: { y: [0, -8, 0] },
    hover: { y: -5, scale: 1.1 },
  },
  rotate: {
    initial: { rotate: 0 },
    animate: { rotate: [0, 5, -5, 0] },
    hover: { rotate: 360, scale: 1.1 },
  },
  shake: {
    initial: { x: 0 },
    animate: { x: [0, -3, 3, -3, 3, 0] },
    hover: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  },
  float: {
    initial: { y: 0 },
    animate: { y: [0, -5, 0], rotate: [0, 2, -2, 0] },
    hover: { y: -10, scale: 1.15 },
  },
  glow: {
    initial: { filter: 'brightness(1)' },
    animate: { filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] },
    hover: { filter: 'brightness(1.5)', scale: 1.1 },
  },
}

export function AnimatedIcon({
  children,
  animation = 'float',
  color = 'from-indigo-500 to-purple-500',
  size = 'md',
  className = '',
  hoverOnly = false,
}: AnimatedIconProps) {
  const animationVariant = animations[animation]

  return (
    <motion.div
      className={`relative rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white ${sizeClasses[size]} ${className}`}
      initial="initial"
      animate={hoverOnly ? 'initial' : 'animate'}
      whileHover="hover"
      variants={animationVariant}
      transition={{
        duration: 2,
        repeat: hoverOnly ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${color} blur-xl opacity-0`}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <span className="relative z-10">{children}</span>
    </motion.div>
  )
}

// Icon with ring animation
interface RingIconProps {
  children: ReactNode
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RingIcon({ children, color = 'indigo', size = 'md' }: RingIconProps) {
  return (
    <div className="relative">
      {/* Animated rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-xl border-2 border-${color}-500/30`}
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      <div
        className={`relative rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center text-white ${sizeClasses[size]}`}
      >
        {children}
      </div>
    </div>
  )
}

// Icon with particles
interface ParticleIconProps {
  children: ReactNode
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ParticleIcon({ children, color = 'indigo', size = 'md' }: ParticleIconProps) {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i / 6) * 360,
    delay: i * 0.1,
  }))

  return (
    <motion.div className="relative group" whileHover="hover">
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-1.5 h-1.5 rounded-full bg-${color}-400`}
          style={{
            left: '50%',
            top: '50%',
          }}
          variants={{
            hover: {
              x: Math.cos((particle.angle * Math.PI) / 180) * 30,
              y: Math.sin((particle.angle * Math.PI) / 180) * 30,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            },
          }}
          transition={{
            duration: 0.6,
            delay: particle.delay,
          }}
        />
      ))}

      <motion.div
        className={`relative rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center text-white ${sizeClasses[size]}`}
        variants={{
          hover: { scale: 1.1 },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
