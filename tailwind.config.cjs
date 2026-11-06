/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        emerald: 'var(--emerald)',
        gold: 'var(--gold)',
        paper: 'var(--paper)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
