import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base must match the GitHub Pages repo name, e.g. https://<user>.github.io/roc-workspace/
export default defineConfig({
  base: '/roc-workspace/',
  plugins: [react()],
})
