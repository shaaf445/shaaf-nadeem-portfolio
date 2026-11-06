import type { LucideIcon } from 'lucide-react'
import { Braces, Database, Workflow, Wrench } from 'lucide-react'

export const skills: { title: string; icon: LucideIcon; number: string; items: { name: string; level?: string }[] }[] = [
  {
    title: 'Backend Development',
    icon: Database,
    number: '01',
    items: [
      { name: 'Python', level: 'Core' },
      { name: 'FastAPI', level: 'Core' },
      { name: 'REST APIs' },
      { name: 'Authentication workflows' },
      { name: 'SQL / Databases' },
    ],
  },
  {
    title: 'AI & Automation',
    icon: Workflow,
    number: '02',
    items: [
      { name: 'Zapier', level: 'Core' },
      { name: 'Make.com', level: 'Core' },
      { name: 'n8n', level: 'Core' },
      { name: 'Webhooks & API integrations' },
      { name: 'AI workflows' },
      { name: 'Google Workspace automation' },
      { name: 'YouTube automation' },
    ],
  },
  {
    title: 'Frontend & Web',
    icon: Braces,
    number: '03',
    items: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
      { name: 'WordPress' },
    ],
  },
  {
    title: 'Tools & Professional',
    icon: Wrench,
    number: '04',
    items: [
      { name: 'Git' },
      { name: 'JSON' },
      { name: 'Microsoft Office' },
      { name: 'Data scraping & mining' },
      { name: 'Lead generation' },
      { name: 'Product research' },
      { name: 'Problem solving' },
      { name: 'Communication' },
    ],
  },
]
