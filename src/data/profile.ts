import type { LucideIcon } from 'lucide-react'
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react'

export const profile = {
  name: 'Muhammad Shaaf Nadeem',
  initials: 'MSN',
  role: 'Backend Developer & AI Automation Specialist',
  roleLabel: 'BACKEND & AI AUTOMATION',
  roles: [
    'Backend Developer',
    'AI Automation Specialist',
    'Python & FastAPI Engineer',
    'YouTube & Content Automation',
  ],
  tagline: 'I build Python/FastAPI backends and AI-powered automations that save time and scale.',
  location: 'Bahawalpur, Pakistan',
  email: 'shaafnadeem14@gmail.com',
  photo: '/images/profile.jpg',
  bio: [
    "I'm a Computer Science student at the Islamia University of Bahawalpur and a Web Developer at TechNest Nova (Private) Limited.",
    'I build Python/FastAPI backend applications, REST APIs, database-driven systems and authentication workflows.',
    'I design multi-step AI business automations with Zapier, Make.com and n8n, including webhooks, API integrations, AI processing and Google Workspace. I also work on YouTube automation and AI-driven content workflows, focusing on practical, scalable and efficient solutions.',
  ],
  languages: ['Urdu (native)', 'English'],
  aboutStats: [
    { value: '2026', label: 'Joined TechNest Nova', countUp: true },
    { value: '3', label: 'Automation platforms (Zapier, Make, n8n)', countUp: true },
    { value: 'BSCS', label: 'Currently pursuing', countUp: false },
    { value: 'FastAPI', label: 'Core backend stack', countUp: false },
  ],
  contactMessage: 'Have a project, an automation idea, or a backend to build? Reach out directly.',
  cvPath: '/cv.pdf', // TODO: Add cv.pdf to the public folder.
}

export const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export const socialLinks = {
  email: { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
  whatsApp: { label: 'WhatsApp', href: 'https://wa.me/923206808639', icon: MessageCircle },
  linkedIn: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shaaf-nadeem-64a138430', icon: Linkedin },
  gitHub: { label: 'GitHub', href: 'https://github.com/shaaf445', icon: Github },
} satisfies Record<string, { label: string; href: string; icon: LucideIcon }>

export const socials = Object.values(socialLinks)

export const contactMethods = {
  email: {
    label: socialLinks.email.label,
    value: profile.email,
    href: socialLinks.email.href,
    icon: socialLinks.email.icon,
    external: false,
  },
  linkedIn: {
    label: socialLinks.linkedIn.label,
    value: 'Shaaf Nadeem',
    href: socialLinks.linkedIn.href,
    icon: socialLinks.linkedIn.icon,
    external: true,
  },
}
