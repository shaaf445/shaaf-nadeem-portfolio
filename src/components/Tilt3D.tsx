import { useRef, type ReactNode, type PointerEvent } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Pointer-driven 3D tilt with a moving glare highlight.
 * Children can use the `depth-*` classes to float at different Z depths.
 */
export function Tilt3D({ children, className = '', max = 9, as: Tag = 'div', onClick }: {
  children: ReactNode
  className?: string
  max?: number
  as?: 'div' | 'article' | 'button'
  onClick?: () => void
}) {
  const ref = useRef<HTMLElement | null>(null)
  const frame = useRef(0)
  const reducedMotion = useReducedMotion()

  const move = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const bounds = el.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width
    const py = (event.clientY - bounds.top) / bounds.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
      el.classList.add('is-tilting')
    })
  }

  const leave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.classList.remove('is-tilting')
  }

  return (
    <Tag
      ref={ref as never}
      className={`tilt3d ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={onClick}
      {...(Tag === 'button' ? { type: 'button' } : {})}
    >
      <div className="tilt3d-inner">
        {children}
        <span className="tilt3d-glare" aria-hidden="true" />
      </div>
    </Tag>
  )
}
