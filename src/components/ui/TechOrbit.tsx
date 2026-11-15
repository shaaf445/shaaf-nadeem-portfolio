const ringOne = ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'REST APIs', 'JWT Auth', 'Groq · Llama', 'Git']
const ringTwo = ['Zapier', 'Make.com', 'n8n', 'Webhooks', 'Google Sheets', 'Slack', 'Flutter', 'JavaScript']

function Ring({ items, className }: { items: string[]; className: string }) {
  return (
    <div className={`orbit-ring ${className}`}>
      {items.map((item, index) => (
        <span key={item} className="orbit-chip" style={{ ['--i' as string]: index, ['--n' as string]: items.length }}>
          <span>{item}</span>
        </span>
      ))}
    </div>
  )
}

/** A CSS-3D rotating tech-stack globe: two tilted rings of chips around a glowing core. */
export function TechOrbit() {
  return (
    <div className="tech-orbit" aria-label="Technologies: Python, FastAPI, PostgreSQL, Zapier, Make.com, n8n, Flutter and more">
      <div className="tech-orbit-stage">
        <div className="tech-orbit-core"><span>STACK</span></div>
        <Ring items={ringOne} className="orbit-ring--one" />
        <Ring items={ringTwo} className="orbit-ring--two" />
      </div>
    </div>
  )
}
