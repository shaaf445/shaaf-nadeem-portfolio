import { useEffect, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
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

export function Hero({ entered }: { entered: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const reducedMotion = useReducedMotion()

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
        <motion.div
          className="hero-index"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Tilt3D className="hero-portrait" max={14}>
            <div className="hero-portrait-card">
              <img src={profile.photoCutout} srcSet={`${profile.photoCutoutSmall} 384w, ${profile.photoCutout} 768w`} sizes="(max-width: 760px) 200px, 300px" width={768} height={1075} alt={`Portrait of ${profile.name}`} fetchPriority="high" decoding="async" />
              <span className="hero-portrait-shine" aria-hidden="true" />
            </div>
            <span className="hero-portrait-ring hero-portrait-ring--a" aria-hidden="true" />
            <span className="hero-portrait-ring hero-portrait-ring--b" aria-hidden="true" />
            <span className="hero-portrait-badge depth-4"><span className="eyebrow-dot" />OPEN TO WORK</span>
            <span className="hero-portrait-chip hero-portrait-chip--a depth-3">FastAPI</span>
            <span className="hero-portrait-chip hero-portrait-chip--b depth-3">AI Automation</span>
            <span className="hero-portrait-chip hero-portrait-chip--c depth-3">Flutter</span>
          </Tilt3D>
          <span>{profile.role}</span>
          <span>{profile.location}</span>
        </motion.div>
      </div>
      <a className="hero-scroll" href="#about"><span className="hero-scroll-line" /><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
    </section>
  )
}
