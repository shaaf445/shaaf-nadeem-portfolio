import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { LogoMark } from './Logo'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = { onComplete: () => void }

const MIN_DURATION = 2600
const STATUS = ['Initialising 3D scene', 'Loading projects', 'Polishing details', 'Ready']
const LAYERS = 7

/**
 * 3D intro loader: an extruded SHAAF hexagon spinning inside a gyroscope of rings,
 * a perspective grid floor, a progress counter, then a split-curtain reveal.
 */
export function Preloader({ onComplete }: Props) {
  const reducedMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useEffect(() => {
    let pageReady = document.readyState === 'complete'
    let fontsReady = false
    const onLoad = () => { pageReady = true }
    window.addEventListener('load', onLoad)
    void document.fonts?.ready.then(() => { fontsReady = true })

    const start = performance.now()
    const minimum = reducedMotion ? 500 : MIN_DURATION
    let frame = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const timeShare = Math.min(1, elapsed / minimum)
      const assetsShare = (pageReady ? 0.5 : 0.25) + (fontsReady ? 0.5 : 0.2)
      // Ease towards whichever is lower, so the counter never outruns real loading.
      const target = Math.min(timeShare, Math.min(1, assetsShare)) * 100
      setProgress((current) => Math.max(current, Math.round(current + (target - current) * 0.12 + (target > current ? 0.4 : 0))))
      const finished = timeShare >= 1 && pageReady && fontsReady
      if (finished) {
        setProgress(100)
        exit()
        return
      }
      // Safety net: never hold the visitor longer than 7 seconds.
      if (elapsed > 7000) { setProgress(100); exit(); return }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    function exit() {
      if (done.current) return
      done.current = true
      const el = root.current
      if (!el || reducedMotion) {
        gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete })
        return
      }
      gsap.timeline({ delay: 0.35, onComplete })
        .to(el.querySelector('.loader3d-stage'), { scale: 1.6, z: 300, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, 0)
        .to(el.querySelector('.loader3d-meta'), { y: 30, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0)
        .to(el.querySelector('.loader3d-curtain--top'), { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.45)
        .to(el.querySelector('.loader3d-curtain--bottom'), { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, 0.45)
        .to(el.querySelector('.loader3d-floor'), { autoAlpha: 0, duration: 0.5 }, 0.3)
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('load', onLoad)
    }
  }, [onComplete, reducedMotion])

  const status = STATUS[Math.min(STATUS.length - 1, Math.floor(progress / 34))]

  return (
    <div className="loader3d" ref={root} role="status" aria-live="polite" aria-label={`Loading portfolio, ${progress}%`}>
      <div className="loader3d-curtain loader3d-curtain--top" />
      <div className="loader3d-curtain loader3d-curtain--bottom" />
      <div className="loader3d-floor" aria-hidden="true"><div /></div>

      <div className="loader3d-stage" aria-hidden="true">
        <div className="loader3d-gyro">
          <span className="loader3d-ring loader3d-ring--x" />
          <span className="loader3d-ring loader3d-ring--y" />
          <span className="loader3d-ring loader3d-ring--z" />
          <span className="loader3d-orbit"><i /></span>
          <div className="loader3d-logo">
            {Array.from({ length: LAYERS }, (_, index) => (
              <span key={index} className="loader3d-layer" style={{ transform: `translateZ(${(index - (LAYERS - 1) / 2) * 2.2}px)`, opacity: index === LAYERS - 1 || index === 0 ? 1 : 0.55 }}>
                <LogoMark size={120} />
              </span>
            ))}
          </div>
        </div>
        <span className="loader3d-glow" />
      </div>

      <div className="loader3d-meta">
        <p className="loader3d-word" aria-hidden="true">
          {'SHAAF'.split('').map((letter, index) => <span key={index} style={{ animationDelay: `${0.15 + index * 0.08}s` }}>{letter}</span>)}
        </p>
        <p className="loader3d-role">BACKEND DEVELOPER · AI AUTOMATION</p>
        <div className="loader3d-bar"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
        <div className="loader3d-row">
          <span>{status}</span>
          <span className="loader3d-count">{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  )
}
