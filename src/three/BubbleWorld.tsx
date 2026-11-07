import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Color, Object3D, TextureLoader, type InstancedMesh, type MeshPhysicalMaterial } from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { profile } from '../data/profile'

gsap.registerPlugin(ScrollTrigger)

const COLORS = {
  gold: new Color('#7ac2e3'),
  emerald: new Color('#3b82f6'),
  shadow: new Color('#292f38'),
  float: [new Color('#3b82f6'), new Color('#5fb5dd'), new Color('#dfe3e8'), new Color('#60a5fa'), new Color('#7fa9bd')],
}

function TrackPortraitAsset() {
  useLoader(TextureLoader, profile.photo)
  return null
}

type Point = { x: number; y: number; z: number; brightness: number }
type Bubble = {
  origin: [number, number, number]
  target: [number, number, number]
  color: Color
  radius: number
  phase: number
  delay: number
}

function randomFor(index: number, seed: number) {
  const value = Math.sin((index + 1) * seed * 91.73) * 43758.5453
  return value - Math.floor(value)
}

function samplePortrait(image: HTMLImageElement): Point[] {
  const width = 160
  const height = Math.round(width * image.naturalHeight / image.naturalWidth)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return []

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.filter = 'blur(0.7px)'
  context.drawImage(image, 0, 0, width, height)
  context.filter = 'none'
  const pixels = context.getImageData(0, 0, width, height).data
  const points: Point[] = []
  const faceEnd = Math.floor(height * 0.6)

  for (let y = 0; y < height; y += 1) {
    const step = y < faceEnd ? 2 : 4
    for (let x = 0; x < width; x += step) {
      const offset = (y * width + x) * 4
      const red = pixels[offset]
      const green = pixels[offset + 1]
      const blue = pixels[offset + 2]
      const alpha = pixels[offset + 3]
      if (alpha < 24 || (red > 235 && green > 235 && blue > 235)) continue

      const brightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
      points.push({
        x: x / (width - 1) - 0.5,
        y: 0.5 - y / (height - 1),
        z: (brightness - 0.42) * 0.35,
        brightness,
      })
    }
  }
  return points
}

function loadPortrait(): Promise<Point[]> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      try {
        resolve(samplePortrait(image))
      } catch {
        resolve([])
      }
    }
    image.onerror = () => resolve([])
    image.src = profile.photo
  })
}

function colorForBrightness(brightness: number) {
  if (brightness > 0.69) return COLORS.gold.clone().lerp(new Color('#cfedfb'), Math.min(0.42, (brightness - 0.69) * 1.1))
  if (brightness > 0.3) return COLORS.emerald.clone().lerp(new Color('#95afda'), (brightness - 0.3) * 0.38)
  return COLORS.shadow.clone().lerp(new Color('#525c6a'), brightness * 0.4)
}

function makeBubbles(count: number, points: Point[]): Bubble[] {
  const pointStep = points.length > count ? points.length / count : 1

  return Array.from({ length: count }, (_, index) => {
    const random = (seed: number) => randomFor(index, seed)
    const origin: [number, number, number] = [
      (random(1) - 0.5) * 20,
      (random(2) - 0.5) * 12,
      (random(3) - 0.5) * 7,
    ]
    const point = points.length > 0 ? points[Math.min(points.length - 1, Math.floor(index * pointStep))] : undefined
    const brightness = point?.brightness ?? random(4)
    const dark = brightness <= 0.3
    return {
      origin,
      target: point ? [point.x, point.y, point.z + (random(5) - 0.5) * 0.13] : origin,
      color: point ? colorForBrightness(brightness) : COLORS.float[index % COLORS.float.length].clone(),
      radius: point
        ? dark ? 0.032 + brightness * 0.025 : 0.026 + brightness * 0.031
        : 0.018 + random(6) * 0.026,
      phase: random(7) * Math.PI * 2,
      delay: random(8) * 0.12,
    }
  })
}

function Bubbles({ count, progress, pointer, mobile }: {
  count: number
  progress: { value: number }
  pointer: { x: number; y: number }
  mobile: boolean
}) {
  const mesh = useRef<InstancedMesh>(null)
  const material = useRef<MeshPhysicalMaterial>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { viewport, size } = useThree()
  const reducedMotion = useReducedMotion()
  const [points, setPoints] = useState<Point[]>([])
  const bubbles = useMemo(() => makeBubbles(count, points), [count, points])

  useEffect(() => {
    let active = true
    void loadPortrait().then((sampledPoints) => {
      if (active && sampledPoints.length > 0) setPoints(sampledPoints)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    bubbles.forEach((bubble, index) => mesh.current?.setColorAt(index, bubble.color))
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [bubbles])

  useFrame(({ clock }) => {
    if (!mesh.current || !material.current || document.hidden) return
    const time = clock.elapsedTime
    const scrollProgress = progress.value
    let portraitStrength = 0
    const portraitWidth = mobile
      ? viewport.width * 0.7
      : Math.min(viewport.width * 0.39, viewport.height * 0.82 * 768 / 1075)
    const portraitHeight = portraitWidth * 1075 / 768
    const centerX = mobile ? 0 : viewport.width * 0.22
    const centerY = mobile ? 0 : -viewport.height * 0.015

    bubbles.forEach((bubble, index) => {
      const wander = reducedMotion ? 0 : 1
      const driftSpeed = 0.16 + scrollProgress * 0.9
      const driftX = Math.sin(time * driftSpeed + bubble.phase) * (0.13 + scrollProgress * 0.16) * wander
      const driftY = Math.cos(time * driftSpeed * 0.78 + bubble.phase * 1.4) * (0.11 + scrollProgress * 0.13) * wander
      const formProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.35 * 1.12 - bubble.delay))
      const formEase = formProgress * formProgress * (3 - 2 * formProgress)
      const dissolveProgress = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.25 * 1.12 - bubble.delay))
      const dissolveEase = dissolveProgress * dissolveProgress * (3 - 2 * dissolveProgress)
      const portraitMix = scrollProgress < 0.2 ? 0 : scrollProgress < 0.55 ? formEase : scrollProgress < 0.75 ? 1 : 1 - dissolveEase
      portraitStrength = Math.max(portraitStrength, portraitMix)
      const breathing = reducedMotion ? 0 : Math.sin(time * 0.75 + bubble.phase) * 0.014 * portraitMix
      let x = bubble.origin[0] * (1 - portraitMix) + (centerX + bubble.target[0] * portraitWidth) * portraitMix + driftX * (1 - portraitMix) + breathing
      let y = bubble.origin[1] * (1 - portraitMix) + (centerY + bubble.target[1] * portraitHeight) * portraitMix + driftY * (1 - portraitMix)
      let z = bubble.origin[2] * (1 - portraitMix) + bubble.target[2] * portraitWidth * 0.32 * portraitMix

      if (!reducedMotion) {
        const pointerX = pointer.x * viewport.width
        const pointerY = pointer.y * viewport.height
        const dx = x - pointerX
        const dy = y - pointerY
        const distance = Math.hypot(dx, dy)
        if (distance > 0 && distance < 1.15) {
          const force = (1 - distance / 1.15) * 0.22 * (1 - portraitMix * 0.7)
          x += dx / distance * force
          y += dy / distance * force
        }
      }

      const flutter = reducedMotion ? 1 : 0.9 + Math.sin(time * 0.8 + bubble.phase) * 0.07
      const sizeVariation = 1 + Math.sin(index * 0.17) * 0.025
      const radius = bubble.radius * flutter * sizeVariation * (0.78 + portraitMix * 0.22)
      dummy.position.set(x, y, z)
      dummy.rotation.set(
        reducedMotion ? 0 : time * 0.1 + bubble.phase,
        reducedMotion ? 0 : time * 0.13 + bubble.phase * 0.5,
        reducedMotion ? 0 : time * 0.06,
      )
      dummy.scale.set(radius, radius, radius)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    material.current.opacity = 0.46 + portraitStrength * 0.48
    material.current.emissiveIntensity = 0.14 + portraitStrength * 0.32
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial
        ref={material}
        color="#ffffff"
        roughness={0.12}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.07}
        emissive="#162235"
        emissiveIntensity={0.14}
        opacity={0.46}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function PortraitScrollDriver({ progress }: { progress: { value: number } }) {
  const { invalidate } = useThree()

  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      onUpdate: invalidate,
    })
    timeline
      .to(progress, { value: 0.2, duration: 0.2, ease: 'none' })
      .to(progress, { value: 0.55, duration: 0.35, ease: 'none' })
      .to(progress, { value: 0.75, duration: 0.2, ease: 'none' })
      .to(progress, { value: 1, duration: 0.25, ease: 'none' })
    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [invalidate, progress])

  return null
}

function CanvasFallback() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const dots = Array.from({ length: 240 }, (_, index) => ({
      x: randomFor(index, 1),
      y: randomFor(index, 2),
      radius: 1 + randomFor(index, 3) * 3,
      phase: index * 0.4,
      color: ['#3b82f6', '#5fb5dd', '#e9e9df', '#60a5fa'][index % 4],
    }))
    let frame = 0
    let width = 0
    let height = 0
    const resize = () => {
      width = element.clientWidth
      height = element.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = width * ratio
      element.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = (time: number) => {
      if (!document.hidden) {
        context.clearRect(0, 0, width, height)
        dots.forEach((dot) => {
          context.beginPath()
          context.fillStyle = dot.color
          context.globalAlpha = 0.38
          context.shadowBlur = 12
          context.shadowColor = dot.color
          const driftX = reducedMotion ? 0 : Math.sin(time * 0.00025 + dot.phase) * 12
          const driftY = reducedMotion ? 0 : Math.cos(time * 0.0002 + dot.phase) * 12
          context.arc(dot.x * width + driftX, dot.y * height + driftY, dot.radius, 0, Math.PI * 2)
          context.fill()
        })
      }
      frame = window.requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(draw)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion])

  return <canvas ref={canvas} className="bubble-fallback" aria-hidden="true" />
}

export function BubbleWorld() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [size, setSize] = useState(() => typeof window === 'undefined' ? 1024 : window.innerWidth)
  const pointer = useRef({ x: 0, y: 0 })
  const progress = useRef({ value: 0 })
  const count = size < 1200 ? 1600 : 2400

  useEffect(() => {
    const onVisibilityChange = () => setVisible(!document.hidden)
    const onResize = () => setSize(window.innerWidth)
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5
      pointer.current.y = 0.5 - event.clientY / window.innerHeight
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div className="bubble-world" aria-hidden="true">
      {visible && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.25]}
          frameloop={reducedMotion ? 'demand' : 'always'}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
          fallback={<CanvasFallback />}
        >
          <ambientLight intensity={0.62} />
          <pointLight position={[4, 5, 6]} intensity={42} color="#77a4f8" />
          <pointLight position={[-5, -2, 4]} intensity={22} color="#5fb5dd" />
          <Suspense fallback={null}><TrackPortraitAsset /></Suspense>
          <PortraitScrollDriver progress={progress.current} />
          <Bubbles count={count} progress={progress.current} pointer={pointer.current} mobile={size < 700} />
        </Canvas>
      )}
    </div>
  )
}
