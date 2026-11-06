import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
            <Reveal key={skill.title} delay={index * 0.07}>
              <motion.article className="skill-card glass-card" whileHover={{ y: -5, borderColor: 'rgba(0,200,83,.4)' }} transition={{ duration: 0.25 }}>
                <div className="skill-card-top"><span className="skill-number">{skill.number} / 04</span><ArrowUpRight size={15} className="skill-arrow" /></div>
                <Icon className="skill-icon" size={24} strokeWidth={1.4} />
                <h3>{skill.title}</h3>
                <ul>{skill.items.map((item) => <li key={item.name}><span />{item.name}{item.level && <small className="skill-level">{item.level}</small>}</li>)}</ul>
              </motion.article>
            </Reveal>
          )
        })}
      </div>
      <p className="skills-footnote"><span className="eyebrow-dot" />CORE STACK: PYTHON · FASTAPI · n8n · ZAPIER · MAKE.COM</p>
    </section>
  )
}
