import { education } from '../data/education'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Education() {
  return (
    <section className="section-shell section-block education-section" id="education">
      <SectionHeading index="05 / EDUCATION" eyebrow="CURRENTLY LEARNING & GROWING" title={<>Computer science<br /><span className="text-gradient">foundations.</span></>} detail="Academic studies at institutions in Bahawalpur." />
      <div className="education-grid">
        {education.map((item, index) => (
          <Reveal key={item.degree} delay={index * 0.08}>
            <article className="education-card glass-card">
              <span className="education-period">{item.period}</span>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
