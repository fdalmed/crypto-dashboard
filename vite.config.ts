import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/crypto-dashboard/', 
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  }
})