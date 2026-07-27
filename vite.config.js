import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base must match the GitHub Pages repo name, e.g. https://<user>.github.io/roc-workspace/
export default defineConfig({
  base: '/roc-workspace/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'The Workshop',
        short_name: 'Workshop',
        description: 'A project workspace, from first idea to finished work',
        theme_color: '#0B3E9E',
        background_color: '#FAF6EE',
        display: 'standalone',
        start_url: '/roc-workspace/',
        scope: '/roc-workspace/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
