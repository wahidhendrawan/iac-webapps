import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-syntax-highlighter') || id.includes('refractor') || id.includes('prismjs')) return 'syntax-highlighter'
            if (id.includes('@xyflow')) return 'flow-canvas'
            if (id.includes('html-to-image')) return 'image-export'
            if (id.includes('lucide-react')) return 'ui-icons'
            if (id.includes('jszip')) return 'zip'
            if (id.includes('zustand')) return 'state'
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'react-vendor'
          }
        },
      },
    },
  },
})
