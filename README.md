# Muhammad Shaaf Nadeem | Backend Developer & AI Automation Specialist

A responsive, 3D-animated single-page portfolio built with React 18, TypeScript, Vite, Three.js / React Three Fiber, GSAP, Lenis and Framer Motion.

## Get started

```bash
npm install
npm run dev
```

Production build and local preview:

```bash
npm run build
npm run preview
```

## Sections

3D loader · Hero (3D tilt portrait) · About · Skills (3D tech-stack orbit) · Projects · Experience · Education · Certifications (3D cards + full-screen viewer) · Services · Contact

## Where content lives

| Content | File |
| --- | --- |
| Name, bio, links, navigation | `src/data/profile.ts` |
| Projects and their documentation (Maharat, AI Resume Analyzer, AI ChatBot, Lead Qualification, Student Admission, Invoice automation) | `src/data/projects.ts` (`docs` field) |
| Certifications | `src/data/certifications.ts` |
| Experience, education, skills, services | `src/data/*.ts` |
| Project cover images | `public/images/projects/` |
| Certificate images | `public/images/certificates/` |
| Profile photo | `public/images/profile.jpg` |
| CV download | `public/cv.pdf` |

To add a project, add an entry to `src/data/projects.ts` with an image in `public/images/projects/`. To add a certificate, drop the image in `public/images/certificates/` and add an entry to `src/data/certifications.ts`.

## Brand

- Theme: navy `#060a14`, blue `#3b82f6` / `#60a5fa`, gold accent `#e0b354` (variables at the top of `src/styles.css`).
- Fonts: Plus Jakarta Sans and JetBrains Mono, self-hosted through `@fontsource` (no Google Fonts request).
- Logo: `src/components/Logo.tsx` (SHAAF mark + wordmark); favicon at `public/favicon.svg`.

## 3D and motion

- `src/components/Preloader.tsx` — 3D gyroscope loader with the SHAAF logo; finishes automatically.
- `src/components/Cursor.tsx` — custom cursor; add `data-cursor="Label"` to any element to show a label bubble.
- `src/components/ProjectDocs.tsx` — 3D documentation modal opened by “Read docs”.

- `src/components/Tilt3D.tsx` — pointer-driven 3D tilt with glare and depth layers (`depth-1` … `depth-4`).
- `src/components/TechOrbit.tsx` — CSS-3D rotating tech-stack rings.
- `src/components/Reveal.tsx` — scroll reveals, with a `variant="3d"` perspective entrance.
- `src/styles-3d.css` — all 3D styles.
- Visitors with "reduce motion" enabled get a calm, static version automatically.
