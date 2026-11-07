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
  workEmail: 'shaafnadeem@technestnova.com',
  photo: '/images/profile.jpg',
  photoCutout: '/images/profile-cutout.webp',
  photoCutoutSmall: '/images/profile-cutout-sm.webp',
  bio: [
    "I'm a Computer Science student at the Islamia University of Bahawalpur and a Web Developer at TechNest Nova (Private) Limited.",
    'I build Python/FastAPI backend applications, REST APIs, database-driven systems and authentication workflows.',
    'I design multi-step AI business automations with Zapier, Make.com and n8n, including webhooks, API integrations, AI processing and Google Workspace. I also work on YouTube automation and AI-driven content workflows, focusing on practical, scalable and efficient solutions.',
  ],
  languages: ['Urdu (native)', 'English'],
  aboutStats: [
    { value: '2026', label: 'Joined TechNest Nova', countUp: true },
    { value: '6', label: 'Featured projects', countUp: true },
    { value: '3', label: 'Certifications', countUp: true },
    { value: 'FastAPI', label: 'Core backend stack', countUp: false },
  ],
  contactMessage: 'Have a project, an automation idea, or a backend to build? Reach out directly.',
  cvPath: '/cv.pdf',
}

// Opens Gmail's compose window in a new tab with the recipient filled in.
const gmailCompose = (to: string) => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`

export const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export const socialLinks = {
  email: { label: 'Email', href: gmailCompose(profile.email), icon: Mail },
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
    external: true,
  },
  workEmail: {
    label: 'Work email',
    value: profile.workEmail,
    href: gmailCompose(profile.workEmail),
    icon: Mail,
    external: true,
  },
  linkedIn: {
    label: socialLinks.linkedIn.label,
    value: 'Shaaf Nadeem',
    href: socialLinks.linkedIn.href,
    icon: socialLinks.linkedIn.icon,
    external: true,
  },
}
