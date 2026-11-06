import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/three/')) return 'three'
          if (id.includes('/@react-three/')) return 'react-three'
          if (id.includes('/gsap/')) return 'gsap'
          if (id.includes('/framer-motion/')) return 'motion'
          if (id.includes('/lenis/')) return 'lenis'
          if (id.includes('/lucide-react/')) return 'icons'
        },
      },
    },
  },
})
