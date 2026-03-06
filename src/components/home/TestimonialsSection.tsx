import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  text: string
  author: string
  role: string
  company?: string
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
    <section className="py-24" id="testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            O que dizem sobre nós
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Criadores e profissionais que usam Saraiva.ai no dia a dia
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8 md:p-12">
            {/* Decorative quote mark */}
            <div className="absolute top-6 left-8 text-6xl font-display text-primary/10 leading-none select-none">"</div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 40 : -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                {/* Rating */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-foreground/90 font-medium leading-relaxed mb-8">
                  {current.text}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white text-sm font-bold">
                    {current.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{current.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {current.role}{current.company && ` · ${current.company}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-1.5">
              <button
                onClick={() => paginate(-1)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40'
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
