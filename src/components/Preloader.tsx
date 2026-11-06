import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Environment, useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Color,
  Object3D,
  type InstancedMesh,
} from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = { onComplete: () => void }

type BubbleSeed = {
  position: [number, number, number]
  scale: number
  phase: number
  speed: number
  sizeClass: 'large' | 'medium' | 'small'
  tint: Color
}

const BUBBLE_COLORS = ['#00c853', '#d4af37', '#f4f2e9', '#1d2821']

function makeSeeds(count: number): BubbleSeed[] {
  return Array.from({ length: count }, (_, index) => {
    const random = (seed: number) => {
      const value = Math.sin((index + 1) * seed * 91.73) * 43758.5453
      return value - Math.floor(value)
    }
    const bucket = index % 20
    const sizeRoll = random(9)
    const sizeClass = sizeRoll > 0.9 ? 'large' : sizeRoll < 0.3 ? 'small' : 'medium'
    const scale = sizeClass === 'large'
      ? 0.3 + random(4) * 0.19
      : sizeClass === 'small'
        ? 0.075 + random(4) * 0.055
        : 0.15 + random(4) * 0.13
    const tint = bucket < 9
      ? BUBBLE_COLORS[0]
      : bucket < 16
        ? BUBBLE_COLORS[1]
        : BUBBLE_COLORS[2 + bucket % 2]
    return {
      position: [
        (random(1) - 0.5) * 8.6,
        (random(2) - 0.5) * 11,
        sizeClass === 'large' ? 1 + random(3) * 1.7 : sizeClass === 'small' ? -4.8 + random(3) * 1.4 : -1.5 + random(3) * 3,
      ],
      scale,
      phase: random(5) * Math.PI * 2,
      speed: 0.12 + random(6) * 0.16,
      sizeClass,
      tint: new Color(tint),
    }
  })
}

function BubbleField({ progress, count }: { progress: number; count: number }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const seeds = useMemo(() => makeSeeds(count), [count])
  const burst = useRef(0)
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!mesh.current) return
    seeds.forEach((seed, index) => mesh.current?.setColorAt(index, seed.tint))
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [seeds])

  useEffect(() => {
    if (progress < 100) {
      burst.current = 0
      return
    }
    const tween = gsap.to(burst, { current: 1, duration: 0.78, ease: 'power2.in' })
    return () => { tween.kill() }
  }, [progress])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5
      pointer.current.y = 0.5 - event.clientY / window.innerHeight
    }
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return
      pointer.current.x = Math.max(-0.5, Math.min(0.5, event.gamma / 90))
      pointer.current.y = Math.max(-0.5, Math.min(0.5, (event.beta - 35) / 90))
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('deviceorientation', onOrientation, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return
    const time = clock.elapsedTime
    const progressFactor = progress / 100
    const burstFactor = burst.current
    const parallax = 0.11 + progressFactor * 0.22
    const targetZ = 8.5 - progressFactor * 1.35
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 0.65)
    camera.position.x += (pointer.current.x * 0.22 - camera.position.x) * Math.min(1, delta * 0.35)
    camera.position.y += (pointer.current.y * 0.18 - camera.position.y) * Math.min(1, delta * 0.35)
    camera.lookAt(0, 0, 0)

    seeds.forEach((seed, index) => {
      const density = Math.max(0.05, Math.min(1, (progressFactor * 1.7 - (index % 17) / 17) * 1.2))
      const rise = time * seed.speed * (1 + progressFactor * 3.1)
      const floatY = ((seed.position[1] + rise + 6) % 12) - 6
      const drift = 0.035 + progressFactor * 0.17
      const swayX = Math.sin(time * seed.speed * (1.7 + progressFactor) + seed.phase) * drift
      const swayY = Math.sin(time * seed.speed * 0.72 + seed.phase * 1.9) * drift * 0.6
      const burstDistance = burstFactor * (3 + Math.abs(seed.position[2]) * 2.8)
      const directionLength = Math.hypot(seed.position[0], seed.position[1], 3) || 1
      dummy.position.set(
        seed.position[0] + pointer.current.x * parallax * (1 + Math.abs(seed.position[2]) * 0.15) + swayX + seed.position[0] / directionLength * burstDistance,
        floatY + pointer.current.y * parallax * (1 + Math.abs(seed.position[2]) * 0.15) + swayY + seed.position[1] / directionLength * burstDistance,
        seed.position[2] + Math.sin(time * seed.speed + seed.phase) * 0.12 + burstFactor * 8,
      )
      const wobble = 1 + Math.sin(time * seed.speed * 2 + seed.phase) * 0.06
      const visibility = 0.25 + density * 0.75
      const burstScale = 1 + burstFactor * 0.45
      dummy.rotation.set(time * seed.speed * 0.35 + seed.phase, time * seed.speed * 0.45 + seed.phase * 0.6, Math.sin(time * seed.speed + seed.phase) * 0.08)
      dummy.scale.set(seed.scale * wobble * visibility * burstScale, seed.scale / wobble * visibility * burstScale, seed.scale * visibility * burstScale)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(index, dummy.matrix)
    })

    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 20, 20]} />
      <meshPhysicalMaterial
        roughness={0.05}
        metalness={0.015}
        transmission={1}
        thickness={1.2}
        ior={1.3}
        clearcoat={1}
        clearcoatRoughness={0.04}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        envMapIntensity={1.6}
        attenuationColor="#c6e7d0"
        attenuationDistance={1.35}
      />
    </instancedMesh>
  )
}

function CallScene({ progress, count }: { progress: number; count: number }) {
  const { camera, invalidate } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 8.5)
    camera.lookAt(0, 0, 0)
    let frame = 0
    const renderWhileVisible = () => {
      if (!document.hidden) invalidate()
      frame = window.requestAnimationFrame(renderWhileVisible)
    }
    const onVisibilityChange = () => {
      window.cancelAnimationFrame(frame)
      if (!document.hidden) frame = window.requestAnimationFrame(renderWhileVisible)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    if (!document.hidden) frame = window.requestAnimationFrame(renderWhileVisible)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [camera, invalidate])

  return (
    <>
      <Environment preset="city" background={false} />
      <ambientLight intensity={0.55} color="#c9f3d9" />
      <pointLight position={[-3, 3, 4]} intensity={13} color="#00ff88" distance={12} />
      <pointLight position={[3, -2, 1]} intensity={9} color="#d4af37" distance={11} />
      <pointLight position={[0, 0, 6]} intensity={4} color="#ffffff" distance={10} />
      <BubbleField progress={progress} count={count} />
    </>
  )
}

function PhoneIcon({ ended = false }: { ended?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={ended ? 'ios-phone-icon ios-phone-icon--ended' : 'ios-phone-icon'}>
      <path d="M7.05 2.5c.55-.55 1.45-.55 2 0l2.2 2.2a1.4 1.4 0 0 1 .3 1.54l-.94 2.2a1.4 1.4 0 0 0 .3 1.54l1.11 1.11a1.4 1.4 0 0 0 1.54.3l2.2-.94a1.4 1.4 0 0 1 1.54.3l2.2 2.2c.55.55.55 1.45 0 2l-1.42 1.42c-.82.82-2.04 1.17-3.18.9-3.11-.73-6.05-2.66-8.5-5.12C3.94 9.7 2 6.76 1.27 3.65c-.27-1.14.08-2.36.9-3.18L3.6-.96" transform="translate(2 2)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusIcons() {
  return (
    <div className="ios-status-icons" aria-label="Mobile signal, Wi-Fi and battery">
      <svg viewBox="0 0 18 14" aria-hidden="true">
        <path d="M1 12V9.5h2V12H1Zm4 0V7h2v5H5Zm4 0V4.5h2V12H9Zm4 0V2h2v10h-2Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true">
        <path d="M1.2 4.7a11.2 11.2 0 0 1 15.6 0L9 12.8 1.2 4.7Z" fill="currentColor" />
        <path d="M4.3 7.7a6.8 6.8 0 0 1 9.4 0" fill="none" stroke="#101111" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 26 14" aria-hidden="true">
        <rect x="1" y="1.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3.2" y="3.7" width="15" height="6.6" rx="1.6" fill="currentColor" />
        <path d="M23.5 5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ActionIcon({ kind }: { kind: 'alarm' | 'message' }) {
  if (kind === 'alarm') {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M7.1 4.8 4 2.6M20.9 4.8 24 2.6M14 7.2v6.2l4.1 2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="14" r="9.2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10.5 24h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M5 5.3h18a2 2 0 0 1 2 2v11.2a2 2 0 0 1-2 2H12l-6.5 4v-4H5a2 2 0 0 1-2-2V7.3a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.2 11.3h11.6M8.2 15.3h7.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Preloader({ onComplete }: Props) {
  const { progress } = useProgress()
  const [visibleProgress, setVisibleProgress] = useState(0)
  const [connected, setConnected] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(false)
  const screen = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const startTime = useRef(Date.now())
  const completed = useRef(false)
  const reducedMotion = useReducedMotion()
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches)
  const bubbleCount = mobile ? 40 : 100

  const connect = useCallback(() => setConnected(true), [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setWebglAvailable(false)
      return
    }
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2') ?? probe.getContext('webgl')
    setWebglAvailable(Boolean(context))
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  }, [reducedMotion])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const elapsed = Date.now() - startTime.current
      const minimumProgress = Math.min(100, (elapsed / 4000) * 100)
      const next = Math.min(progress, minimumProgress)
      setVisibleProgress((current) => Math.max(current, next))
      if (progress >= 100 && elapsed >= 4000) {
        setVisibleProgress(100)
        if (!completed.current) {
          completed.current = true
          window.setTimeout(connect, reducedMotion ? 0 : 350)
        }
        return
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [connect, progress, reducedMotion])

  useEffect(() => {
    if (!connected || !screen.current) return
    const timer = window.setTimeout(() => {
      if (!screen.current) return
      gsap.timeline({ onComplete })
        .to(screen.current, {
          scale: reducedMotion ? 1 : 1.045,
          opacity: 0,
          duration: reducedMotion ? 0.12 : 0.72,
          ease: 'power3.inOut',
        })
    }, reducedMotion ? 0 : 850)
    return () => window.clearTimeout(timer)
  }, [connected, onComplete, reducedMotion])

  useEffect(() => {
    if (reducedMotion || !tilt.current) return
    const target = tilt.current
    const applyTilt = (x: number, y: number) => {
      target.style.transform = `perspective(1000px) rotateX(${Math.max(-6, Math.min(6, y))}deg) rotateY(${Math.max(-6, Math.min(6, x))}deg)`
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      applyTilt(x * 12, -y * 12)
    }
    const onPointerLeave = () => { target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)' }
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return
      applyTilt(event.gamma * 0.15, (event.beta - 35) * 0.12)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('deviceorientation', onOrientation)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [reducedMotion])

  return (
    <div className="preloader" ref={screen} role="dialog" aria-modal="true" aria-label="Incoming call from Portfolio">
      <div className="ios-phone-tilt" ref={tilt} style={{ perspective: 1000, transformStyle: 'preserve-3d', display: 'grid', width: '100%', height: '100%', placeItems: 'center', transition: reducedMotion ? 'none' : 'transform 120ms ease-out' }}>
        <div className="ios-phone-frame">
          <div className="ios-wallpaper ios-wallpaper--emerald" />
          <div className="ios-wallpaper ios-wallpaper--gold" />
          <div className="ios-wallpaper ios-wallpaper--mint" />
          <div className="ios-dark-overlay" />
          {webglAvailable && !reducedMotion && (
            <Canvas
              aria-hidden="true"
              camera={{ position: [0, 0, 8.5], fov: 40 }}
              dpr={[1, 1.5]}
              frameloop="demand"
              gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
              fallback={null}
              style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', filter: 'drop-shadow(0 0 7px rgba(0,200,83,.2)) drop-shadow(0 0 15px rgba(212,175,55,.1))' }}
            >
              <CallScene progress={visibleProgress} count={bubbleCount} />
            </Canvas>
          )}
          <div className="ios-ui-layer" style={{ position: 'absolute', zIndex: 2, inset: 0, pointerEvents: 'none' }}>
            <div className="ios-dynamic-island" aria-hidden="true" />
            <div className="ios-status-bar">
              <span aria-hidden="true" />
              <StatusIcons />
            </div>

            <div className="ios-caller">
              <div className="ios-caller-copy">
                <h1>PORTFOLIO</h1>
                <p><span className="ios-mobile-icon"><PhoneIcon /></span>mobile</p>
              </div>
            </div>

            <div className="ios-call-actions" aria-hidden="true">
              <div className="ios-action">
                <span className="ios-action-icon" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.13), 0 8px 18px rgba(0,0,0,.2), 0 0 18px rgba(0,200,83,.07)' }}><ActionIcon kind="alarm" /></span>
                <span>Remind Me</span>
              </div>
              <div className="ios-action">
                <span className="ios-action-icon" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.13), 0 8px 18px rgba(0,0,0,.2), 0 0 18px rgba(0,200,83,.07)' }}><ActionIcon kind="message" /></span>
                <span>Message</span>
              </div>
            </div>

            <div className="ios-answer-area">
              <div className="ios-slider" role="progressbar" aria-label="Loading portfolio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(visibleProgress)}>
                <span className={`ios-slider-label${connected ? ' is-connected' : ''}`}>
                  {connected ? 'Connected' : 'slide to answer'}
                </span>
                <span className="ios-slider-percent">{Math.round(visibleProgress)}%</span>
                <motion.span
                  className={`ios-slider-thumb${connected ? ' is-connected' : ''}`}
                  style={{ boxShadow: '0 3px 11px rgba(0,0,0,.3), 0 0 20px rgba(0,200,83,.34), inset 0 1px 0 rgba(255,255,255,.95)' }}
                  animate={{ left: `calc(5px + ${visibleProgress}% - ${visibleProgress * 0.58}px)` }}
                  transition={{ duration: reducedMotion ? 0 : 0.12, ease: 'linear' }}
                >
                  <PhoneIcon ended={connected} />
                </motion.span>
              </div>
              <div className="ios-home-indicator" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
