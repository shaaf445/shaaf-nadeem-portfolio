import { useId } from 'react'

/** SHAAF brand mark: a faceted hexagon with a stylised "S", optionally with the wordmark. */
export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`lg-${id}`} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93c5fd" />
          <stop offset=".55" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#5bb7e1" />
        </linearGradient>
        <linearGradient id={`fill-${id}`} x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#132448" />
          <stop offset="1" stopColor="#070c18" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5L24 2.5Z" fill={`url(#fill-${id})`} stroke={`url(#lg-${id})`} strokeWidth="1.6" />
      <path d="M24 2.5v10.2M42.6 13.25l-8.8 5.1M42.6 34.75l-8.8-5.1M24 45.5V35.3M5.4 34.75l8.8-5.1M5.4 13.25l8.8 5.1" stroke="#3b82f6" strokeOpacity=".35" strokeWidth="1" />
      <path d="M31.2 17.4c-1.3-2-3.9-3.2-7-3.2-4 0-6.9 2-6.9 5 0 6.6 14.4 3.4 14.4 10.2 0 3.2-3.1 5.4-7.6 5.4-3.4 0-6.2-1.3-7.6-3.6" stroke={`url(#lg-${id})`} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ caption }: { caption?: string }) {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-text">
        <span className="logo-word">SHAAF<span className="logo-dot">.</span></span>
        {caption && <small>{caption}</small>}
      </span>
    </span>
  )
}
