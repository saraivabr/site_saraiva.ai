import { motion, AnimatePresence } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { useCardAnimations } from '../../hooks/useCardAnimations'

interface InteractiveCardProps {
  title: string
  description: string
  icon?: ReactNode
  gradient?: string
  expandedContent?: ReactNode
  className?: string
}

export function InteractiveCard({
  title,
  description,
  icon,
  gradient = 'from-indigo-500 to-purple-500',
  expandedContent,
  className = '',
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    cardRef,
    isHovered,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useCardAnimations({ maxRotation: 10 })

  return (
    <>
      <motion.div
        ref={cardRef}
        className={`relative group cursor-pointer ${className}`}
        style={{
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => expandedContent && setIsExpanded(true)}
      >
        <motion.div
          className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 blur-xl`}
            animate={{ opacity: isHovered ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
            animate={{ x: isHovered ? '200%' : '-100%' }}
            transition={{ duration: 0.6 }}
          />

          {/* Content */}
          <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
            {icon && (
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white`}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {icon}
              </motion.div>
            )}

            <motion.h3
              className="text-xl font-bold text-white mb-2"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h3>

            <motion.p
              className="text-slate-400 text-sm leading-relaxed"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              {description}
            </motion.p>

            {expandedContent && (
              <motion.div
                className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium"
                animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0 }}
              >
                <span>Ver mais</span>
                <motion.span animate={{ x: isHovered ? 5 : 0 }}>→</motion.span>
              </motion.div>
            )}
          </div>

          {/* Corner decoration */}
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`} />
        </motion.div>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {isExpanded && expandedContent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="relative max-w-2xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-700"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 text-white text-2xl`}>
                {icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
              <div className="text-slate-400">{expandedContent}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Cards grid with stagger animation
interface CardsGridProps {
  children: ReactNode
  className?: string
}

export function CardsGrid({ children, className = '' }: CardsGridProps) {
  return (
    <motion.div
      className={`grid gap-6 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function CardWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
