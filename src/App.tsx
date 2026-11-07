import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Cursor } from './components/Cursor'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Education } from './sections/Education'
import { Services } from './sections/Services'
import { Certifications } from './sections/Certifications'
import { Contact } from './sections/Contact'
import { SafeBoundary } from './components/SafeBoundary'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BubbleWorld = lazy(() => import('./three/BubbleWorld').then((module) => ({ default: module.BubbleWorld })))

function ScrollProgress() {
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return null
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [load3D, setLoad3D] = useState(false)

  // The WebGL background is decorative: load it only on capable desktops, after the intro, when the browser is idle.
  useEffect(() => {
    if (!entered) return
    const capable = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && (navigator.hardwareConcurrency ?? 4) >= 4
      && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (!capable) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setLoad3D(true), { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = globalThis.setTimeout(() => setLoad3D(true), 1200)
    return () => globalThis.clearTimeout(timer)
  }, [entered])
  useSmoothScroll()

  const openPortfolio = useCallback(() => {
    setEntered(true)
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 80)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-loading', !entered)
    return () => document.body.classList.remove('is-loading')
  }, [entered])

  useEffect(() => {
    let frame = 0
    const refresh = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const images = Array.from(document.images)
    images.forEach((image) => image.addEventListener('load', refresh))
    window.addEventListener('load', refresh)
    void document.fonts.ready.then(refresh)
    refresh()
    return () => {
      window.cancelAnimationFrame(frame)
      images.forEach((image) => image.removeEventListener('load', refresh))
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {load3D && <SafeBoundary><Suspense fallback={null}><BubbleWorld /></Suspense></SafeBoundary>}
      {!entered && <Preloader onComplete={openPortfolio} />}
      <div className={`site-shell${entered ? ' site-shell--ready' : ''}`}>
        <Navbar />
        <main id="main">
          <Hero entered={entered} />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Certifications />
          <Services />
          <Contact />
        </main>
      </div>
      <Cursor />
      <ScrollProgress />
    </MotionConfig>
  )
}
