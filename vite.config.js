import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: ['tests/**', 'node_modules/**'],
    globals: true,
    setupFiles: ['./src/setup.js'],
    coverage: {
      exclude: ['src/main.jsx', 'node_modules/', 'tests/'],
    },
  },
})
