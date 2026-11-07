import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Reveal({ children, className = '', delay = 0, variant = 'fade' }: { children: ReactNode; className?: string; delay?: number; variant?: 'fade' | '3d' }) {
  const reducedMotion = useReducedMotion()
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!element.current) return
    if (reducedMotion) {
      gsap.set(element.current, { clearProps: 'opacity,visibility,transform' })
      return
    }

    const tween = gsap.fromTo(
      element.current,
      variant === '3d'
        ? { autoAlpha: 0, y: 70, rotateX: 18, z: -120, transformPerspective: 1200, transformOrigin: '50% 100%' }
        : { autoAlpha: 0, y: 24 },
      {
        immediateRender: false,
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        z: 0,
        duration: variant === '3d' ? 1.1 : 0.7,
        delay,
        ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: {
          trigger: element.current,
          start: 'top 85%',
          once: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [delay, reducedMotion, variant])

  return (
    <div
      ref={element}
      className={className}
      data-reveal
    >
      {children}
    </div>
  )
}
