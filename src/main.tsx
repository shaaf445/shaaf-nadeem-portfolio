import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { socialLinks } from './data/profile'
import './styles.css'
import './styles-3d.css'

const personSchema = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]')
if (!personSchema) throw new Error('Person structured data script is missing.')

const personData = JSON.parse(personSchema.textContent ?? '{}')
personData.sameAs = [socialLinks.linkedIn.href, socialLinks.gitHub.href]
personSchema.textContent = JSON.stringify(personData)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
