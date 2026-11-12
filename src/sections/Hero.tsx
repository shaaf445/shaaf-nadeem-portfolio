import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { profile, socialLinks } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Tilt3D } from '../components/Tilt3D'

function MagneticLink({ href, children, className }: { href: string; children: ReactNode; className: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <a
      href={href}
      className={className}
      target={href.startsWith('https://') ? '_blank' : undefined}
      rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
      onMouseMove={(event) => {
        if (reducedMotion) return
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - bounds.left - bounds.width / 2
        const y = event.clientY - bounds.top - bounds.height / 2
        event.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.14}px)`
      }}
      onMouseLeave={(event) => { event.currentTarget.style.transform = '' }}
    >
      {children}
    </a>
  )
}

/**
 * Scroll-linked fade for the hero portrait.
 * Progress runs from 0 (page top) to 1 (portrait's bottom edge about to leave the screen),
 * measured per device so the fade feels the same on phones, tablets and laptops.
 * A soft spring smooths out jumpy touch / wheel scrolling.
 */
function usePortraitFade(target: RefObject<HTMLElement>, disabled: boolean) {
  const { scrollY } = useScroll()
  const fadeEnd = useRef(400)

  useEffect(() => {
    const measure = () => {
      const el = target.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const bottom = rect.bottom + window.scrollY
      // Finish fading a little before the portrait scrolls off-screen.
      fadeEnd.current = Math.max(220, bottom * 0.85)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    const late = window.setTimeout(measure, 1200)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.clearTimeout(late)
    }
  }, [target])

  const raw = useTransform(scrollY, (y) => (disabled ? 0 : Math.min(1, Math.max(0, y / fadeEnd.current))))
  const progress = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.6, restDelta: 0.0005 })
  const opacity = useTransform(progress, [0, 0.15, 1], [1, 0.97, 0])
  const y = useTransform(progress, [0, 1], [0, -48])
  const scale = useTransform(progress, [0, 1], [1, 0.92])
  return { opacity, y, scale }
}

export function Hero({ entered }: { entered: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const portraitRef = useRef<HTMLDivElement>(null)
  const fade = usePortraitFade(portraitRef, reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setRoleIndex((value) => (value + 1) % profile.roles.length), 3000)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  return (
    <section className="hero section-shell" id="top" aria-labelledby="hero-title">
      <div className="hero-grid">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow hero-location"><span className="eyebrow-dot" />{profile.location.toUpperCase()}</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-small">HELLO, I’M</span>
            <span className="hero-title-large">{profile.name}</span>
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-role" aria-live="polite">
            <span className="role-dash" />
            <motion.span key={roleIndex} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {profile.roles[roleIndex]}
            </motion.span>
          </div>
          <div className="hero-actions">
            <MagneticLink href="#work" className="button button--primary">Explore selected work <MoveUpRight size={17} /></MagneticLink>
            <MagneticLink href={socialLinks.email.href} className="button button--text">Let’s talk <ArrowUpRight size={16} /></MagneticLink>
            <a href={profile.cvPath} download className="button button--text">Download CV <ArrowDownToLine size={16} /></a>
          </div>
        </motion.div>
        <motion.div ref={portraitRef} className="hero-side" style={reducedMotion ? undefined : fade}>
        <motion.div
          className="hero-index"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Tilt3D className="hero-portrait" max={14}>
            <div className="hero-portrait-card">
              <img src={profile.photoCutout} srcSet={`${profile.photoCutoutSmall} 384w, ${profile.photoCutout} 768w`} sizes="(max-width: 760px) 200px, 300px" width={768} height={1075} alt={`Portrait of ${profile.name}`} loading="eager" fetchPriority="high" decoding="async" />
            </div>
            <span className="hero-portrait-badge depth-4"><span className="eyebrow-dot" />OPEN TO WORK</span>
          </Tilt3D>
          <span>{profile.role}</span>
          <span>{profile.location}</span>
        </motion.div>
        </motion.div>
      </div>
      <a className="hero-scroll" href="#about"><span className="hero-scroll-line" /><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
    </section>
  )
}
