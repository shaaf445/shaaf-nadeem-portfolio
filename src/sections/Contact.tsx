import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Check, Copy, MessageCircle } from 'lucide-react'
import { contactMethods, profile, socials } from '../data/profile'
import { Logo } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Contact() {
  const [copyStatus, setCopyStatus] = useState<'copied' | 'error' | null>(null)
  const feedbackTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current)
  }, [])

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable.')
      await navigator.clipboard.writeText(contactMethods.email.value)
      setCopyStatus('copied')
    } catch (error) {
      console.error('Unable to copy the email address.', error)
      setCopyStatus('error')
    }

    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = window.setTimeout(() => setCopyStatus(null), 1800)
  }

  return (
    <section className="section-shell section-block contact-section" id="contact">
      <SectionHeading index="08 / CONTACT" eyebrow="LET’S BUILD SOMETHING USEFUL" title={<>Have a project<br /><span className="text-gradient">in mind?</span></>} detail={profile.contactMessage} />
      <div className="contact-grid">
        <Reveal className="contact-left">
          <div className="contact-invite">
            <span className="contact-orb"><MessageCircle size={23} strokeWidth={1.3} /></span>
            <p className="eyebrow">LET’S MAKE SOMETHING MATTER</p>
            <h3>Backend, AI &amp;<br /><span className="text-gold">automation.</span></h3>
            <p className="contact-location">{profile.location}</p>
            <a className="button button--primary contact-cv" href={profile.cvPath} download>Download CV <ArrowDownToLine size={16} /></a>
          </div>
          <div className="social-block">
            <span className="eyebrow">FIND ME ELSEWHERE</span>
            <div className="social-links">
              {socials.map((social) => {
                const Icon = social.icon
                const external = social.href.startsWith('https://')
                return <a key={social.label} href={social.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={`${social.label}${external ? ' (opens in a new tab)' : ''}`}>{social.label !== 'WhatsApp' && <Icon size={17} />}<span>{social.label}</span></a>
              })}
            </div>
          </div>
        </Reveal>
        <Reveal className="contact-card-wrap" delay={0.12}>
          <div className="contact-card glass-card">
            <span className="eyebrow">DIRECT CONTACT</span>
            <h3>Contact me</h3>
            <p className="contact-card-intro">Have a project or an idea? Reach out directly.</p>
            <div className="contact-methods">
              {Object.values(contactMethods).map((method) => {
                const Icon = method.icon
                return (
                  <a
                    className="contact-method"
                    key={method.label}
                    href={method.href}
                    target={method.external ? '_blank' : undefined}
                    rel={method.external ? 'noopener noreferrer' : undefined}
                    aria-label={`${method.label}: ${method.value}${method.external ? ' (opens in a new tab)' : ''}`}
                  >
                    <span className="contact-method-icon"><Icon size={20} /></span>
                    <span className="contact-method-copy"><span>{method.label}</span><strong>{method.value}</strong></span>
                    <ArrowRight className="contact-method-arrow" size={18} />
                  </a>
                )
              })}
            </div>
            <button type="button" className="copy-email" onClick={copyEmail} aria-label={`Copy email address ${contactMethods.email.value}`}>
              {copyStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}
              {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Copy failed' : 'Copy email'}
            </button>
            <span className="copy-feedback" role="status" aria-live="polite">
              {copyStatus === 'copied' ? 'Email address copied.' : copyStatus === 'error' ? 'Unable to copy the email address.' : ''}
            </span>
          </div>
        </Reveal>
      </div>
      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><Logo caption={profile.name.toUpperCase()} /></a>
        <p>{profile.location}<span>© {new Date().getFullYear()} {profile.name}</span></p>
        <nav className="social-links footer-social-links" aria-label="Social links">
          {socials.map((social) => {
            const Icon = social.icon
            const external = social.href.startsWith('https://')
            return <a key={social.label} href={social.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={`${social.label}${external ? ' (opens in a new tab)' : ''}`}><Icon size={17} /><span>{social.label}</span></a>
          })}
        </nav>
        <a href="#top" className="back-to-top">BACK TO THE BEGINNING <ArrowUpRight size={14} /></a>
      </footer>
    </section>
  )
}
