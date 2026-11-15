# Muhammad Shaaf Nadeem — Portfolio

Personal portfolio of Muhammad Shaaf Nadeem, Backend Developer & AI Automation Specialist.

**Live site:** [shaaf.technestnova.com](https://shaaf.technestnova.com)

A responsive, single-page portfolio with 3D effects, built with React 18, TypeScript, Vite, Three.js (React Three Fiber), GSAP, Lenis and Framer Motion.

---

## Getting started

Requires Node.js 20 (see `.nvmrc`).

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

## Project structure

```
shaaf-nadeem-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Builds and deploys to GitHub Pages on every push to main
├── public/                     # Static files, copied as-is into the build
│   ├── fonts/                  # Self-hosted Plus Jakarta Sans + JetBrains Mono
│   ├── images/
│   │   ├── certificates/       # Certificate images (.jpg + .webp + -sm.webp)
│   │   ├── projects/           # Project cover images (.jpg + .webp + -sm.webp)
│   │   ├── profile.jpg         # Profile photo (bubble portrait, social preview)
│   │   ├── profile-cutout.webp # Hero photo, background removed
│   │   └── profile-cutout-sm.webp
│   ├── .htaccess               # Apache config (only used if hosted on cPanel)
│   ├── cv.pdf                  # "Download CV" file
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/             # Page chrome: Navbar, Preloader, Cursor
│   │   ├── three/              # WebGL scene: BubbleWorld (3D bubble background + portrait)
│   │   └── ui/                 # Reusable pieces: Logo, Reveal, SectionHeading, Tilt3D,
│   │                           #   TechOrbit, ProjectDocs, SafeBoundary
│   ├── data/                   # All site content (edit these to update the portfolio)
│   ├── hooks/                  # useReducedMotion, useSmoothScroll
│   ├── sections/               # Page sections in order: Hero, About, Skills, Projects, ...
│   ├── styles/
│   │   ├── global.css          # Theme colors, fonts, layout and section styles
│   │   └── effects.css         # 3D, motion and hero-portrait styles
│   ├── utils/
│   │   └── image.ts            # Responsive image helper
│   ├── App.tsx                 # Page composition
│   └── main.tsx                # Entry point
├── index.html                  # HTML shell, SEO and social meta tags
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts
```

## Updating content

| What | Where |
| --- | --- |
| Name, bio, links, navigation | `src/data/profile.ts` |
| Projects and their write-ups (`docs` field) | `src/data/projects.ts` |
| Certifications | `src/data/certifications.ts` |
| Experience, education, skills, services | `src/data/experience.ts`, `education.ts`, `skills.ts`, `services.ts` |
| Project cover images | `public/images/projects/` |
| Certificate images | `public/images/certificates/` |
| Profile photo | `public/images/profile.jpg` and `profile-cutout.webp` |
| CV download | `public/cv.pdf` |

- **Add a project:** add an entry to `src/data/projects.ts` and its image to `public/images/projects/`.
- **Add a certificate:** add the image to `public/images/certificates/` and an entry to `src/data/certifications.ts`.

## Design

- **Colors:** Pale Sage Ivory `#E5E8CE` (background) and Muted Forest Sage `#789575` (accent), with deep forest green text. Theme variables are at the top of `src/styles/global.css`.
- **Fonts:** Plus Jakarta Sans and JetBrains Mono, self-hosted in `public/fonts/`.
- **Logo:** `src/components/ui/Logo.tsx`; favicon at `public/favicon.svg`.

### 3D and motion

| Component | What it does |
| --- | --- |
| `layout/Preloader.tsx` | 3D gyroscope loader with the SHAAF logo |
| `layout/Cursor.tsx` | Custom cursor; add `data-cursor="Label"` to an element to show a label |
| `three/BubbleWorld.tsx` | 3D bubble background that forms the portrait in the About section (desktop only) |
| `ui/Tilt3D.tsx` | Pointer-driven 3D tilt with glare and depth layers |
| `ui/TechOrbit.tsx` | Rotating tech-stack rings |
| `ui/Reveal.tsx` | Scroll reveal animations |
| `ui/ProjectDocs.tsx` | Project documentation modal ("Read docs") |

The hero photo fades out smoothly as the page scrolls. Visitors with "reduce motion" turned on get a calm, static version.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages at the custom domain `shaaf.technestnova.com` (DNS: `CNAME shaaf → shaaf445.github.io`).
