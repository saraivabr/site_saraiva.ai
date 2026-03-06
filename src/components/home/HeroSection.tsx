import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { AnimatedBackground } from './AnimatedBackground'

const words = ['criar', 'automatizar', 'escalar', 'inovar']

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              1000+ recursos de IA curados
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">Tudo para </span>
            <span className="text-primary">{displayText}</span>
            <span className="animate-pulse text-primary">|</span>
            <br />
            <span className="text-foreground">com IA</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Ferramentas, prompts, MCPs e templates — curado para quem cria com inteligência artificial.
          </motion.p>

          {/* Bullets */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {['Ferramentas testadas', 'Prompts prontos', 'MCPs e Templates'].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Explorar biblioteca
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background/50 backdrop-blur-sm rounded-full font-semibold text-lg hover:bg-muted transition-all"
              >
                Falar comigo
              </motion.button>
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
