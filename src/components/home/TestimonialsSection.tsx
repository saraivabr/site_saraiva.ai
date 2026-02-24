import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  text: string
  author: string
  role: string
  company?: string
  avatar?: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    text: 'A biblioteca do Saraiva.ai me economizou semanas de pesquisa. Encontrei os prompts perfeitos para meu projeto em minutos.',
    author: 'Ana Carolina',
    role: 'Product Designer',
    company: 'Startup Tech',
    rating: 5,
  },
  {
    text: 'Os MCPs são incríveis! Consegui automatizar todo meu workflow com as ferramentas que descobri aqui.',
    author: 'Marcus Silva',
    role: 'Desenvolvedor Full Stack',
    company: 'Agência Digital',
    rating: 5,
  },
  {
    text: 'Conteúdo de qualidade e sempre atualizado. É minha fonte principal para novidades em IA.',
    author: 'Roberto Mendes',
    role: 'CTO',
    company: 'SaaS Brasil',
    rating: 5,
  },
  {
    text: 'O plano Pro vale cada centavo. Templates exclusivos que me ajudam diariamente.',
    author: 'Camila Santos',
    role: 'Marketing Manager',
    company: 'E-commerce',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      const next = prev + newDirection
      if (next < 0) return testimonials.length - 1
      if (next >= testimonials.length) return 0
      return next
    })
  }

  const current = testimonials[currentIndex]

  return (
    <section className="py-24 bg-muted/30" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que dizem sobre nós
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Criadores e profissionais que usam Saraiva.ai no dia a dia
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-2xl border border-border p-6 md:p-12 overflow-hidden">
            {/* Quote decoration */}
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-10"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-2xl font-medium mb-6 md:mb-8 leading-relaxed">
                  "{current.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                    {current.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{current.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {current.role} {current.company && `• ${current.company}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2">
              <button
                onClick={() => paginate(-1)}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
