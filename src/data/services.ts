import type { LucideIcon } from 'lucide-react'
import { Database, FileSearch, Sparkles, Workflow } from 'lucide-react'

export const services: { title: string; detail: string; icon: LucideIcon }[] = [
  {
    title: 'Backend & API Development',
    detail: 'FastAPI backends, REST APIs, authentication and database-driven systems.',
    icon: Database,
  },
  {
    title: 'AI Business Automation',
    detail: 'Multi-step workflows with Zapier, Make.com and n8n, webhooks and AI processing.',
    icon: Workflow,
  },
  {
    title: 'YouTube & Content Automation',
    detail: 'AI-driven content pipelines and automated publishing workflows.',
    icon: Sparkles,
  },
  {
    title: 'Data & Lead Generation',
    detail: 'Data scraping, data mining, list building and CRM data entry.',
    icon: FileSearch,
  },
]
