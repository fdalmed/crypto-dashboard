import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/crypto-dashboard/',  // This is CRITICAL for GitHub Pages
  build: {
    outDir: 'dist'
  }
})