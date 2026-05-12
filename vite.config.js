import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold slightly — we split intentionally
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, gets cached for months
          'vendor-react': ['react', 'react-dom'],
          // Router — stable, separate from app code
          'vendor-router': ['react-router-dom'],
          // Axios / API layer
          'vendor-axios': ['axios'],
        },
      },
    },
  },
})
