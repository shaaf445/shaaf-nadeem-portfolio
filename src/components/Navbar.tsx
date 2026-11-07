import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation, profile } from '../data/profile'
import { Logo } from './Logo'

export function Navbar() {
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sections = ['top', 'about', 'skills', 'work', 'experience', 'education', 'certifications', 'contact']
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => item !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.4] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true"><div /></div>
      <header className="site-header">
        <a className="brand" href="#top" onClick={closeMenu} aria-label={`${profile.name}, home`}>
          <Logo caption={profile.roleLabel} />
        </a>
        <nav className={`nav-links${open ? ' nav-links--open' : ''}`} aria-label="Main navigation">
          {navigation.map((item) => {
            const id = item.href.slice(1)
            return <a key={item.href} href={item.href} className={active === id ? 'is-active' : ''} onClick={closeMenu}>{item.label}</a>
          })}
          <a className="nav-availability" href="#contact" onClick={closeMenu}><span />{profile.location}<ArrowUpRight size={14} /></a>
        </nav>
        <button className="mobile-menu" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
    </>
  )
}
