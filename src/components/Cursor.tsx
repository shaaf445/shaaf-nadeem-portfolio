import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Cursor() {
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return
    let frame = 0
    let x = -100
    let y = -100
    let ringX = x
    let ringY = y
    const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY }
    const animate = () => {
      if (dot.current && ring.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        ringX += (x - ringX) * 0.16
        ringY += (y - ringY) * 0.16
        ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      frame = window.requestAnimationFrame(animate)
    }
    const hover = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('a, button, input, textarea')) ring.current?.classList.add('cursor-ring--hover')
      else ring.current?.classList.remove('cursor-ring--hover')
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', hover, { passive: true })
    frame = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', hover)
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <div className="custom-cursor" aria-hidden="true"><span ref={ring} className="cursor-ring" /><span ref={dot} className="cursor-dot" /></div>
}
