import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern mobile browsers — avoids transpiling modern APIs unnecessarily
    target: ['es2020', 'chrome80', 'safari13'],
    // Enable CSS code-splitting per chunk
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split vendor libraries into long-lived cached chunks.
        // Changing app code won't bust the vendor cache on mobile browsers.
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-icons':   ['lucide-react'],
          'vendor-charts':  ['recharts'],
          'vendor-axios':   ['axios'],
        },
      },
    },
  },
})
