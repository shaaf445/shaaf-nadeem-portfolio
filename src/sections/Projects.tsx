import type { MouseEvent } from 'react'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

function tilt(event: MouseEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const x = (event.clientY - bounds.top) / bounds.height - 0.5
  const y = (event.clientX - bounds.left) / bounds.width - 0.5
  event.currentTarget.style.transform = `perspective(1000px) rotateX(${-x * 5}deg) rotateY(${y * 5}deg) translateY(-4px)`
}

function resetTilt(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.transform = ''
}

export function Projects() {
  return (
    <section className="section-shell section-block projects-section" id="work">
      <div className="projects-heading-row">
        <SectionHeading index="03 / PROJECTS" eyebrow="WORK IN PROGRESS" title={<>Current areas of<br /><span className="text-gradient">exploration.</span></>} />
        <Reveal><p className="projects-aside">Coming soon — these cards describe current work areas; project details and links will be added when available.</p></Reveal>
      </div>
      <div className="projects-list">
        {projects.map((project, index) => (
          <Reveal key={project.number} delay={index * 0.08}>
            <motion.article className="project-card glass-card" onMouseMove={tilt} onMouseLeave={resetTilt} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className={`project-art ${project.gradient}`} aria-label={`${project.name}, coming soon`}>
                <span className="project-art-grain" />
                <span className="project-art-orbit project-art-orbit--one" />
                <span className="project-art-orbit project-art-orbit--two" />
                <span className="project-art-mark">{project.mark}</span>
                <span className="project-art-number">{project.number}</span>
                <span className="project-coming-soon">COMING SOON</span>
              </div>
              <div className="project-content">
                <div className="project-meta"><span>{project.category}</span><span>0{index + 1} — 0{projects.length}</span></div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-bottom">
                  <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  {(project.liveUrl || project.githubUrl) && <div className="project-links">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}><ExternalLink size={16} /></a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} source code`}><Github size={16} /></a>}
                  </div>}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
      <a href="#contact" className="all-work-link">HAVE SOMETHING GOOD IN MIND? <span>LET’S MAKE IT REAL <ArrowUpRight size={14} /></span></a>
    </section>
  )
}
