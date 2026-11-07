import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github, Linkedin, Lock, Sparkles } from 'lucide-react'
import { projects, type Project } from '../data/projects'
import { socialLinks } from '../data/profile'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Tilt3D } from '../components/Tilt3D'
import { ProjectDocs } from '../components/ProjectDocs'
import { responsive } from '../lib/img'

function ProjectCard({ project, total, reversed, onDocs }: { project: Project; total: number; reversed?: boolean; onDocs: (project: Project) => void }) {
  const mediaAction = project.docs ? () => onDocs(project) : undefined
  return (
    <Tilt3D as="article" className={`project3d glass-card${project.featured ? ' project3d--featured' : ''}${reversed ? ' project3d--reversed' : ''}`} max={project.featured ? 6 : 9}>
      <div
        className="project3d-media"
        data-cursor={project.docs ? 'Docs' : undefined}
        onClick={mediaAction}
        role={project.docs ? 'button' : undefined}
        tabIndex={project.docs ? 0 : undefined}
        onKeyDown={(event) => { if (mediaAction && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); mediaAction() } }}
        aria-label={project.docs ? `Open ${project.name} documentation` : undefined}
      >
        <img {...responsive(project.image)} sizes={project.featured ? '(max-width: 1080px) 94vw, 640px' : '(max-width: 720px) 94vw, 560px'} width={1280} height={720} alt={project.imageAlt} loading="lazy" decoding="async" style={project.imageFit ? { objectFit: project.imageFit, objectPosition: '50% 0%' } : undefined} />
        <span className="project3d-shade" />
        <span className="project3d-number depth-2">{project.number}</span>
        <span className="project3d-status depth-3"><span className="eyebrow-dot" />{project.status}</span>
      </div>
      <div className="project3d-body">
        <div className="project-meta depth-1"><span>{project.category}</span><span>{project.number} — {String(total).padStart(2, '0')}</span></div>
        <h3 className="depth-2">{project.name}</h3>
        {project.role && <p className="project3d-role depth-1"><Sparkles size={13} /> {project.role}</p>}
        <p className="project3d-desc">{project.description}</p>
        <ul className="project3d-highlights">
          {project.highlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="project3d-footer">
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project3d-actions depth-3">
            {project.docs && (
              <button className="project3d-btn project3d-btn--docs" onClick={() => onDocs(project)}>
                <BookOpen size={15} /> Read docs
              </button>
            )}
            {project.githubUrl && (
              <a className="project3d-btn project3d-btn--ghost" href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github size={15} /> Code <ArrowUpRight size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a className="project3d-btn project3d-btn--ghost" href={project.liveUrl} target="_blank" rel="noreferrer">
                Live demo <ArrowUpRight size={14} />
              </a>
            )}
            {project.privateNote && <span className="project3d-private"><Lock size={13} /> {project.privateNote}</span>}
          </div>
        </div>
      </div>
    </Tilt3D>
  )
}

/** Featured projects take a full row; consecutive regular projects share a two-column grid. */
function groupProjects(list: Project[]) {
  const groups: (Project | Project[])[] = []
  list.forEach((project) => {
    const last = groups[groups.length - 1]
    if (project.featured) groups.push(project)
    else if (Array.isArray(last)) last.push(project)
    else groups.push([project])
  })
  return groups
}

export function Projects() {
  const [docsFor, setDocsFor] = useState<Project | null>(null)
  let featuredCount = 0

  return (
    <section className="section-shell section-block projects-section" id="work">
      <div className="projects-heading-row">
        <SectionHeading index="03 / PROJECTS" eyebrow="SELECTED WORK" title={<>Things I’ve built<br /><span className="text-gradient">and shipped.</span></>} />
        <Reveal><p className="projects-aside">AI-powered backends, conversational AI, n8n and Zapier automations, and a mobile marketplace built with the TechNest Nova team. Open “Read docs” for the full write-up.</p></Reveal>
      </div>

      {groupProjects(projects).map((group) => {
        if (!Array.isArray(group)) {
          const reversed = featuredCount++ % 2 === 1
          return (
            <Reveal key={group.number} className="project3d-featured-wrap" variant="3d">
              <ProjectCard project={group} total={projects.length} reversed={reversed} onDocs={setDocsFor} />
            </Reveal>
          )
        }
        return (
          <div className="project3d-grid" key={group.map((p) => p.number).join('-')}>
            {group.map((project, index) => (
              <Reveal key={project.number} delay={(index % 2) * 0.1} variant="3d">
                <ProjectCard project={project} total={projects.length} onDocs={setDocsFor} />
              </Reveal>
            ))}
          </div>
        )
      })}

      <Reveal variant="3d">
        <div className="explore-more glass-card">
          <div className="explore-more-orb" aria-hidden="true"><span /><span /><span /></div>
          <div className="explore-more-copy">
            <p className="eyebrow"><span className="eyebrow-dot" />MORE WORK</p>
            <h3>Want to explore more projects?</h3>
            <p>Visit my GitHub for source code and new experiments, or connect on LinkedIn for updates, posts and certifications.</p>
          </div>
          <div className="explore-more-actions">
            <a className="button button--primary" href={socialLinks.gitHub.href} target="_blank" rel="noreferrer"><Github size={17} /> github.com/shaaf445 <ArrowUpRight size={15} /></a>
            <a className="button button--text explore-linkedin" href={socialLinks.linkedIn.href} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn profile <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </Reveal>

      <AnimatePresence>{docsFor && <ProjectDocs project={docsFor} onClose={() => setDocsFor(null)} />}</AnimatePresence>
    </section>
  )
}
