import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, BadgeCheck, CalendarDays, ChevronLeft, ChevronRight, Eye, Pause, Play, X } from 'lucide-react'
import { certifications, type Certification } from '../data/certifications'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { responsive } from '../lib/img'
import { useReducedMotion } from '../hooks/useReducedMotion'

const AUTOPLAY_MS = 6000

function Lightbox({ cert, onClose, onPrev, onNext }: { cert: Certification; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = previous
    }
  }, [onClose, onPrev, onNext])

  const img = responsive(cert.image)
  return createPortal(
    <motion.div className="cert-lightbox" role="dialog" aria-modal="true" aria-label={cert.title}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.figure
        key={cert.title}
        className="cert-lightbox-figure"
        initial={{ rotateY: -25, scale: 0.9, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        onClick={(event) => event.stopPropagation()}
      >
        <img src={img.src} alt={`${cert.title} certificate issued to Muhammad Shaaf Nadeem`} width={1280} height={880} />
        <figcaption><strong>{cert.title}</strong><span>{cert.issuer} · {cert.date}</span></figcaption>
        <button className="cert-lightbox-close" onClick={onClose} aria-label="Close certificate"><X size={18} /></button>
        <button className="cert-lightbox-nav cert-lightbox-nav--prev" onClick={onPrev} aria-label="Previous certificate"><ChevronLeft size={20} /></button>
        <button className="cert-lightbox-nav cert-lightbox-nav--next" onClick={onNext} aria-label="Next certificate"><ChevronRight size={20} /></button>
      </motion.figure>
    </motion.div>,
    document.body,
  )
}

export function Certifications() {
  const total = certifications.length
  const [active, setActive] = useState(0)
  const [viewing, setViewing] = useState<number | null>(null)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const paused = userPaused || hovered
  const [inView, setInView] = useState(false)
  const reducedMotion = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)

  const go = useCallback((index: number) => setActive(((index % total) + total) % total), [total])
  const next = useCallback(() => go(active + 1), [active, go])
  const prev = useCallback(() => go(active - 1), [active, go])

  useEffect(() => {
    const el = section.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView || reducedMotion || viewing !== null) return
    const timer = window.setTimeout(next, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [active, paused, inView, reducedMotion, viewing, next])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => { drag.current = { x: event.clientX, moved: false } }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const dx = event.clientX - drag.current.x
    if (Math.abs(dx) > 45) { drag.current.moved = true; if (dx < 0) next(); else prev() }
    window.setTimeout(() => { drag.current = null }, 0)
  }

  const cert = certifications[active]

  return (
    <section ref={section} className="section-shell section-block certs-section" id="certifications">
      <SectionHeading index="06 / CERTIFICATIONS" eyebrow="LICENSES & ACHIEVEMENTS" title={<>Verified learning,<br /><span className="text-gradient">recognised work.</span></>} detail="Swipe or use the arrows to browse. Select “View certificate” to open it in full." />

      <Reveal variant="3d">
        <div
          className="cert-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Certificates"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === 'ArrowRight') next(); if (event.key === 'ArrowLeft') prev() }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="cert-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { drag.current = null }}>
            {certifications.map((item, index) => {
              let offset = index - active
              if (offset > total / 2) offset -= total
              if (offset < -total / 2) offset += total
              const img = responsive(item.image)
              const isActive = offset === 0
              return (
                <button
                  key={item.title}
                  className={`cert-slide${isActive ? ' is-active' : ''}`}
                  style={{ ['--o' as string]: offset, ['--abs' as string]: Math.abs(offset) }}
                  onClick={() => { if (drag.current?.moved) return; if (isActive) setViewing(index); else go(index) }}
                  aria-label={isActive ? `View ${item.title} certificate` : `Show ${item.title}`}
                  aria-hidden={Math.abs(offset) > 1}
                  tabIndex={isActive ? 0 : -1}
                  data-cursor={isActive ? 'View' : undefined}
                >
                  <span className="cert-slide-paper">
                    <img src={img.src} srcSet={img.srcSet} sizes="(max-width: 760px) 90vw, 620px" alt="" width={1280} height={880} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                  </span>
                </button>
              )
            })}
            <button className="cert-arrow cert-arrow--prev" onClick={prev} aria-label="Previous certificate"><ChevronLeft size={20} /></button>
            <button className="cert-arrow cert-arrow--next" onClick={next} aria-label="Next certificate"><ChevronRight size={20} /></button>
          </div>

          <div className="cert-info" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={cert.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <div className="cert-info-top">
                  <span className="cert-type"><Award size={13} />{cert.type}</span>
                  <span className="cert-counter">{String(active + 1).padStart(2, '0')} <i>/</i> {String(total).padStart(2, '0')}</span>
                </div>
                <h3>{cert.title}</h3>
                <p className="cert-issuer"><BadgeCheck size={15} />{cert.issuer}</p>
                <p className="cert-date"><CalendarDays size={14} />{cert.date}</p>
                <p className="cert-desc">{cert.description}</p>
                {cert.credentialId && <p className="cert-id">CREDENTIAL ID <span>{cert.credentialId}</span></p>}
                <div className="project-tags">{cert.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                <button className="button button--primary cert-view" onClick={() => setViewing(active)}><Eye size={17} /> View certificate</button>
              </motion.div>
            </AnimatePresence>

            <div className="cert-controls">
              <div className="cert-thumbs">
                {certifications.map((item, index) => (
                  <button key={item.title} className={`cert-thumb${index === active ? ' is-active' : ''}`} onClick={() => go(index)} aria-label={`Show ${item.title}`} aria-current={index === active}>
                    <img src={responsive(item.image).src.replace('.webp', '-sm.webp')} alt="" width={96} height={66} loading="lazy" decoding="async" />
                    {index === active && !paused && inView && !reducedMotion && viewing === null && <span key={active} className="cert-thumb-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
                  </button>
                ))}
              </div>
              <button className="cert-play" onClick={() => setUserPaused((value) => !value)} aria-label={userPaused ? 'Resume autoplay' : 'Pause autoplay'}>{userPaused ? <Play size={15} /> : <Pause size={15} />}</button>
            </div>
          </div>
        </div>
      </Reveal>

      <AnimatePresence>
        {viewing !== null && (
          <Lightbox
            cert={certifications[viewing]}
            onClose={() => setViewing(null)}
            onPrev={() => { const i = (viewing - 1 + total) % total; setViewing(i); go(i) }}
            onNext={() => { const i = (viewing + 1) % total; setViewing(i); go(i) }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
