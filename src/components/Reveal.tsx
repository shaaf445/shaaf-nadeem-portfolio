import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
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
      { autoAlpha: 0, y: 24 },
      {
        immediateRender: false,
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
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
  }, [delay, reducedMotion])

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
