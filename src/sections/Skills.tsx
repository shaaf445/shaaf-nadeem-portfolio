import { ArrowUpRight } from 'lucide-react'
import { Tilt3D } from '../components/Tilt3D'
import { TechOrbit } from '../components/TechOrbit'
import { skills } from '../data/skills'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Skills() {
  return (
    <section className="section-shell section-block skills-section" id="skills">
      <SectionHeading index="02 / THE TOOLKIT" eyebrow="BACKEND, AUTOMATION & WEB" title={<>Tools for useful<br /><span className="text-gradient">solutions.</span></>} detail="A practical toolkit for backend applications and connected workflows." />
      <div className="skills-grid">
        {skills.map((skill, index) => {
          const Icon = skill.icon
          return (
            <Reveal key={skill.title} delay={index * 0.07} variant="3d">
              <Tilt3D as="article" className="skill-card glass-card" max={10}>
                <div className="skill-card-top"><span className="skill-number">{skill.number} / 04</span><ArrowUpRight size={15} className="skill-arrow" /></div>
                <Icon className="skill-icon depth-3" size={24} strokeWidth={1.4} />
                <h3 className="depth-2">{skill.title}</h3>
                <ul>{skill.items.map((item) => <li key={item.name}><span />{item.name}{item.level && <small className="skill-level">{item.level}</small>}</li>)}</ul>
              </Tilt3D>
            </Reveal>
          )
        })}
      </div>
      <TechOrbit />
      <p className="skills-footnote"><span className="eyebrow-dot" />CORE STACK: PYTHON · FASTAPI · n8n · ZAPIER · MAKE.COM</p>
    </section>
  )
}
