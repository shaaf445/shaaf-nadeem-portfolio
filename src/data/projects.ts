// TODO: Replace these coming-soon entries with real titles, descriptions, GitHub URLs and live links.
export type Project = {
  number: string
  name: string
  category: string
  description: string
  tags: string[]
  gradient: string
  mark: string
  liveUrl?: string
  githubUrl?: string
}

export const projects: Project[] = [
  {
    number: '01',
    name: 'FastAPI Backend',
    category: 'COMING SOON',
    description: 'Coming soon — a backend project based on work with FastAPI, REST APIs, authentication and SQL.',
    tags: ['FastAPI', 'REST', 'Auth', 'SQL'],
    gradient: 'project-art--fern',
    mark: 'FASTAPI',
  },
  {
    number: '02',
    name: 'AI Automation Workflows',
    category: 'COMING SOON',
    description: 'Coming soon — examples of workflow automation built around n8n, Make.com and Zapier.',
    tags: ['n8n', 'Make', 'Zapier'],
    gradient: 'project-art--signal',
    mark: 'AUTOMATION',
  },
  {
    number: '03',
    name: 'YouTube Content Automation',
    category: 'COMING SOON',
    description: 'Coming soon — an AI-assisted content workflow for YouTube automation.',
    tags: ['AI', 'Automation'],
    gradient: 'project-art--atlas',
    mark: 'CONTENT PIPELINE',
  },
]
