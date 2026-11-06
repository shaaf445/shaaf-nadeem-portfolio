import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { services } from '../data/services'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Services() {
  return (
    <section className="section-shell section-block services-section" id="services">
      <SectionHeading index="06 / SERVICES" eyebrow="BACKEND & AUTOMATION" title={<>Build systems that<br /><span className="text-gradient">save time.</span></>} detail="Practical development and automation for real workflows." />
      <div className="services-grid">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Reveal key={service.title} delay={index * 0.1}>
              <motion.article className="service-card" whileHover={{ y: -5 }}>
                <div className="service-top"><Icon size={22} strokeWidth={1.4} /><span>0{index + 1}</span></div>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
                <a href="#contact" aria-label={`Enquire about ${service.title}`}><ArrowUpRight size={17} /></a>
              </motion.article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
