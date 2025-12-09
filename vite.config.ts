import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Ensure .js files are treated as JSX
      loader: {
        '.js': 'jsx',
      },
    },
  },
})