import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    outDir: 'dist', // ✅ Correct output directory
    chunkSizeWarningLimit: 1000 // Optional: raises chunk size warning threshold
  }
})
