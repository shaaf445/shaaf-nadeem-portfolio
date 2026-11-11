import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(0)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const display = useTransform(count, (current) => String(Math.round(current)).padStart(value.length, '0'))

  useEffect(() => {
    if (!isInView) return
    const controls = animate(count, Number(value), { duration: 1.25, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, isInView, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

export function About() {
  return (
    <section className="section-shell section-block about" id="about">
      <SectionHeading index="01 / ABOUT" eyebrow="BACKEND DEVELOPMENT & AUTOMATION" title={<>Practical systems.<br /><span className="text-gradient">Useful automation.</span></>} />
      <div className="about-grid about-grid--single">
        <div className="about-copy">
          <Reveal>
            <p className="about-lead">Backend engineering and <span className="text-gold">AI automation</span> for practical problems.</p>
            {profile.bio.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}
            <p className="about-languages"><strong>Languages</strong>{profile.languages.join(' · ')}</p>
            <a className="inline-link" href="#experience">Explore my experience <ArrowUpRight size={15} /></a>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="stats-row">
              {profile.aboutStats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.countUp ? <CountUp value={stat.value} /> : stat.value}</strong><span>{stat.label}</span></div>)}
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal className="about-note">
        <span>MY APPROACH</span><p>Practical, scalable and efficient solutions.</p><span>BAHAWALPUR</span>
      </Reveal>
    </section>
  )
}
