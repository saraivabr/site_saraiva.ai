import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  color?: string
  height?: number
  showPercentage?: boolean
}

export function ScrollProgress({
  color = 'from-indigo-500 via-purple-500 to-pink-500',
  height = 3,
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${color} origin-left`}
        style={{
          scaleX,
          height,
        }}
      />

      {/* Glow effect */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${color} origin-left blur-sm opacity-50`}
        style={{
          scaleX,
          height: height * 2,
        }}
      />

      {/* Percentage indicator */}
      {showPercentage && (
        <motion.div
          className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span>
            {scrollYProgress.get().toFixed(0)}%
          </motion.span>
        </motion.div>
      )}
    </>
  )
}

// Section divider with parallax
export function ParallaxDivider() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="relative h-32 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
        style={{
          y: useSpring(
            scrollYProgress.get() * 50,
            { stiffness: 100, damping: 30 }
          ),
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>
    </div>
  )
}

// Scroll indicator for sections
interface ScrollIndicatorProps {
  targetId: string
  label?: string
}

export function ScrollIndicator({ targetId, label }: ScrollIndicatorProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.button
      className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {label && <span className="text-xs uppercase tracking-wider">{label}</span>}
      <motion.div
        className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-2 rounded-full bg-current"
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.button>
  )
}
