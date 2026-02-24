import { useEffect, useState, useRef, type RefObject, useCallback } from 'react'
import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'

// Scroll progress hook
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return {
    progress: scrollYProgress,
    smoothProgress,
  }
}

// Intersection Observer hook for scroll-triggered animations
interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '-100px', triggerOnce = true } = options
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView }
}

// Parallax hook
interface UseParallaxOptions {
  speed?: number
  direction?: 'up' | 'down'
}

export function useParallax(
  scrollProgress: MotionValue<number>,
  options: UseParallaxOptions = {}
) {
  const { speed = 0.5, direction = 'up' } = options
  const factor = direction === 'up' ? -1 : 1

  const y = useTransform(scrollProgress, [0, 1], [0, factor * speed * 100])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return smoothY
}

// Multi-layer parallax
export function useMultiLayerParallax(containerRef: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const midgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])

  const backgroundSmooth = useSpring(backgroundY, { stiffness: 100, damping: 30 })
  const midgroundSmooth = useSpring(midgroundY, { stiffness: 100, damping: 30 })
  const foregroundSmooth = useSpring(foregroundY, { stiffness: 100, damping: 30 })

  return {
    background: backgroundSmooth,
    midground: midgroundSmooth,
    foreground: foregroundSmooth,
    scrollProgress: scrollYProgress,
  }
}

// Scroll direction hook
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    setIsAtTop(currentScrollY < 10)

    if (currentScrollY > lastScrollY.current) {
      setDirection('down')
    } else if (currentScrollY < lastScrollY.current) {
      setDirection('up')
    }

    lastScrollY.current = currentScrollY
  }, [])

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [handleScroll])

  return { direction, isAtTop }
}

// Animation variants for scroll-triggered elements
export const scrollAnimationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
}
