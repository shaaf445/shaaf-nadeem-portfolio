import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/experience'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const line = useRef<HTMLSpanElement>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!line.current) return
    const tween = gsap.fromTo(line.current, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '#experience', start: 'top 65%', end: 'bottom 65%', scrub: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section className="section-shell section-block experience-section" id="experience">
      <SectionHeading index="04 / EXPERIENCE" eyebrow="WORK & CONTRIBUTIONS" title={<>Backend, AI &amp;<br /><span className="text-gradient">automation.</span></>} detail="Professional experience in backend development, AI automation, lead generation and community initiatives." />
      <div className="timeline">
        <span className="timeline-line" /><span className="timeline-line-fill" ref={line} />
        {experience.map((item, index) => (
          <Reveal key={`${item.date}-${item.role}`} delay={index * 0.1}>
            <article className="timeline-item">
              <span className="timeline-dot" />
              <p className="timeline-date">{item.date}</p>
              <div className="timeline-content">
                <h3>{item.role}</h3>
                <p className="timeline-company">{item.company}</p>
                <ul className="timeline-bullets">
                  {item.bullets.slice(0, expanded[index] ? item.bullets.length : 3).map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                {item.bullets.length > 3 && (
                  <button className="timeline-expand" type="button" aria-expanded={Boolean(expanded[index])} onClick={() => setExpanded((current) => ({ ...current, [index]: !current[index] }))}>
                    {expanded[index] ? <>Show less <ChevronUp size={15} /></> : <>Show more <ChevronDown size={15} /></>}
                  </button>
                )}
              </div>
              <span className="timeline-index">0{index + 1}</span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
