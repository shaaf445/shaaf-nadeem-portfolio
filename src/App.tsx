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
import { Contact } from './sections/Contact'
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
      <Suspense fallback={null}><BubbleWorld /></Suspense>
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
          <Services />
          <Contact />
        </main>
      </div>
      <Cursor />
      <ScrollProgress />
      <div className="film-grain" aria-hidden="true" />
    </MotionConfig>
  )
}
