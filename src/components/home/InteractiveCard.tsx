import { motion, AnimatePresence } from 'framer-motion'
import { useState, type ReactNode } from 'react'

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
  gradient = 'from-purple-500 to-indigo-500',
  expandedContent,
  className = '',
}: InteractiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <motion.div
        className={`group cursor-pointer ${className}`}
        onClick={() => expandedContent && setIsExpanded(true)}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="relative p-5 rounded-2xl bg-card/70 border border-border/50 hover:border-border backdrop-blur-sm overflow-hidden transition-colors duration-300">
          {/* Subtle glow on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] blur-xl transition-opacity duration-500`} />

          {/* Content */}
          <div className="relative z-10">
            {icon && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white shadow-lg shadow-black/20`}>
                {icon}
              </div>
            )}

            <h3 className="text-base font-semibold font-display text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>
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
              className="relative max-w-2xl w-full p-8 rounded-3xl bg-card border border-border"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
              {icon && (
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 text-white`}>
                  {icon}
                </div>
              )}
              <h2 className="text-xl font-bold font-display text-foreground mb-3">{title}</h2>
              <div className="text-muted-foreground">{expandedContent}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface CardsGridProps {
  children: ReactNode
  className?: string
}

export function CardsGrid({ children, className = '' }: CardsGridProps) {
  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.06 },
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
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
