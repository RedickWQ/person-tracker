import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

const API_BASE = process.env.VITE_API_URL || 'http://localhost:8787';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true
      }
    }
  }
})