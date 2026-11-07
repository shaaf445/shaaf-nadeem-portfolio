import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Custom cursor: a precise dot, a lagging ring that grows on interactive elements,
 * and a label bubble for elements with `data-cursor="Label"`.
 */
export function Cursor() {
  const dot = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.classList.add('has-custom-cursor')
    let frame = 0
    let x = -100
    let y = -100
    let ringX = x
    let ringY = y
    let visible = false

    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!visible) {
        visible = true
        ringX = x
        ringY = y
        ring.current?.parentElement?.classList.add('custom-cursor--visible')
      }
    }
    const animate = () => {
      ringX += (x - ringX) * 0.18
      ringY += (y - ringY) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      if (label.current) label.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frame = requestAnimationFrame(animate)
    }
    const hover = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      const interactive = target?.closest('a, button, input, textarea, select, [role="button"]')
      const text = target?.closest('input, textarea')
      const root = ring.current?.parentElement
      if (!root) return
      root.classList.toggle('custom-cursor--hover', Boolean(interactive) && !labelled)
      root.classList.toggle('custom-cursor--text', Boolean(text))
      root.classList.toggle('custom-cursor--label', Boolean(labelled))
      if (label.current) label.current.firstElementChild!.textContent = labelled?.dataset.cursor ?? ''
    }
    const down = () => ring.current?.parentElement?.classList.add('custom-cursor--down')
    const up = () => ring.current?.parentElement?.classList.remove('custom-cursor--down')
    const leave = () => { visible = false; ring.current?.parentElement?.classList.remove('custom-cursor--visible') }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', hover, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', hover)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return (
    <div className="custom-cursor" aria-hidden="true">
      <span ref={ring} className="cursor-ring"><i /></span>
      <span ref={label} className="cursor-label"><b /></span>
      <span ref={dot} className="cursor-dot"><i /></span>
    </div>
  )
}
