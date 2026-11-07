import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { responsive } from '../lib/img'

export function ProjectDocs({ project, onClose }: { project: Project; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const docs = project.docs!

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      html.style.overflow = previous
    }
  }, [onClose])

  return createPortal(
    <motion.div className="docs-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} documentation`}
        className="docs-panel"
        initial={{ rotateX: 14, y: 80, scale: 0.94, opacity: 0 }}
        animate={{ rotateX: 0, y: 0, scale: 1, opacity: 1 }}
        exit={{ rotateX: 10, y: 60, scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <header className="docs-head">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /><BookOpen size={13} /> PROJECT DOCUMENTATION</p>
            <h2>{project.name}</h2>
            <p className="docs-summary">{docs.summary}</p>
          </div>
          <button className="docs-close" onClick={onClose} aria-label="Close documentation"><X size={18} /></button>
        </header>

        <dl className="docs-facts">
          {docs.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>

        <div className="docs-body">
          {docs.sections.map((section, index) => (
            <section key={section.heading} className="docs-section">
              <h3><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</h3>
              {section.body && <p>{section.body}</p>}
              {section.image && (
                <a className="docs-image" href={section.image.src} target="_blank" rel="noreferrer" data-cursor="Open">
                  <img {...responsive(section.image.src)} sizes="(max-width: 1000px) 94vw, 900px" alt={section.image.alt} loading="lazy" decoding="async" />
                </a>
              )}
              {section.steps && <ol className="docs-steps">{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
              {section.bullets && <ul className="docs-bullets">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
              {section.table && (
                <div className="docs-table-wrap">
                  <table className="docs-table">
                    <thead><tr>{section.table.head.map((cell) => <th key={cell}>{cell}</th>)}</tr></thead>
                    <tbody>{section.table.rows.map((row) => <tr key={row.join('|')}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
              {section.code && <pre className="docs-code"><code>{section.code}</code></pre>}
            </section>
          ))}
        </div>

        <footer className="docs-foot">
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.githubUrl && <a className="project3d-btn" href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={15} /> View on GitHub <ArrowUpRight size={14} /></a>}
        </footer>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
