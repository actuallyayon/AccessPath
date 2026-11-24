'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right'
  delay?: number // milliseconds
  duration?: number // milliseconds
  threshold?: number
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const getAnimationStyles = () => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: 'translateY(36px)',
            transition: baseTransition,
          }
        case 'scale-up':
          return {
            opacity: 0,
            transform: 'scale(0.92) translateY(20px)',
            transition: baseTransition,
          }
        case 'slide-left':
          return {
            opacity: 0,
            transform: 'translateX(36px)',
            transition: baseTransition,
          }
        case 'slide-right':
          return {
            opacity: 0,
            transform: 'translateX(-36px)',
            transition: baseTransition,
          }
        case 'fade-in':
        default:
          return {
            opacity: 0,
            transform: 'none',
            transition: baseTransition,
          }
      }
    }

    return {
      opacity: 1,
      transform: 'none',
      transition: baseTransition,
    }
  }

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  )
}
