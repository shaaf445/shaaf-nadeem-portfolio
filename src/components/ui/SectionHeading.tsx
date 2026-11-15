import type { ReactNode } from 'react'

export function SectionHeading({ index, eyebrow, title, detail }: { index: string; eyebrow: string; title: ReactNode; detail?: string }) {
  return (
    <div className="section-heading">
      <span className="section-index">{index}</span>
      <div>
        <p className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</p>
        <h2>{title}</h2>
        {detail && <p className="section-detail">{detail}</p>}
      </div>
    </div>
  )
}
