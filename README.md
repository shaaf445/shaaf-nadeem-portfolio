# Muhammad Shaaf Nadeem | Backend Developer & AI Automation Specialist

A responsive, single-page portfolio built with React 18, TypeScript, Vite, Tailwind CSS, Three.js / React Three Fiber, GSAP, Lenis, and Framer Motion. The design includes a call-screen intro, a scroll-reactive instanced-bubble portrait, selected work, experience, services, and direct contact links.

## Get started

```bash
npm install
npm run dev
```

The site has no contact form or contact API. Use the email and LinkedIn links in the Contact section to reach out directly.

Create a production build and preview it locally:

```bash
npm run build
npm run preview
```

## Make it yours

1. Profile details, navigation, and contact links live in `src/data/profile.ts`.
2. Update experience, education, skills, services, and projects in `src/data/experience.ts`, `src/data/education.ts`, `src/data/skills.ts`, `src/data/services.ts`, and `src/data/projects.ts`.
3. The supplied portrait is in `public/images/profile.jpg`; profile and bubble-portrait rendering use the photo path from `src/data/profile.ts`.
4. Add your PDF as `public/cv.pdf`; the hero and contact buttons link to it.
5. Edit email, WhatsApp, LinkedIn, and GitHub links in `src/data/profile.ts`. Project cards hide demo/source links until URLs are supplied in `src/data/projects.ts`.

The profile displays Muhammad Shaaf Nadeem and focuses on backend development and AI automation. The portrait uses sampled image brightness and alpha to distribute bubbles; reduce-motion preferences disable the heavy scene movement.
