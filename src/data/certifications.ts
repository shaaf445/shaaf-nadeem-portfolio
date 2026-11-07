export type Certification = {
  title: string
  issuer: string
  date: string
  type: string
  description: string
  image: string
  credentialId?: string
  skills: string[]
}

export const certifications: Certification[] = [
  {
    title: 'Certificate of Fellowship — 12-Week Fellowship Program',
    issuer: 'Click Chain Academy',
    date: 'Jan 2026 – Mar 2026',
    type: 'FELLOWSHIP',
    description:
      'Completed the 12-week Click Chain software development fellowship: full-stack web apps with Python (FastAPI), agile teamwork on real client projects, and daily kata sessions.',
    image: '/images/certificates/click-chain-fellowship.jpg',
    skills: ['FastAPI', 'Git', 'Agile teamwork', 'APIs'],
  },
  {
    title: 'Professional Networking for Career Growth',
    issuer: 'HP LIFE · HP Foundation',
    date: 'Oct 2026',
    type: 'ONLINE COURSE',
    description:
      'Networking strategies for career growth, the role of personal branding, and using digital tools to grow a professional network with confidence.',
    image: '/images/certificates/hp-life-networking.jpg',
    credentialId: 'c72b4868-0fed-43bb-9ab2-47fa9eb4f578',
    skills: ['Networking', 'Personal branding', 'Career growth'],
  },
  {
    title: 'Certificate of Excellence — Mobile & Web Application',
    issuer: 'Juro Gy To Jano Gy · Takhleeq',
    date: 'Sep 2023',
    type: 'EXCELLENCE AWARD',
    description:
      'Recognised for the “Bridge the Gap” mobile and web application concept, presented in a program incubated by Takhleeq with partners including Bayer and Mashal.',
    image: '/images/certificates/bridge-the-gap-excellence.jpg',
    skills: ['Mobile apps', 'Web apps', 'Product thinking'],
  },
]
