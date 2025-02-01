import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { vercel } from '@vercel/plugin-vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), vercel()],
  server: {
    port: process.env.PORT || 5173
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV
  }
})
