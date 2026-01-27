import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // ⚡ Optimización de CSS
    cssCodeSplit: true,
    // ⚡ Target moderno para mejor tree-shaking
    target: 'es2020',
    rollupOptions: {
      output: {
        // ⚡ Code splitting optimizado
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core - carga crítica
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }
            // Router - carga crítica
            if (id.includes('react-router')) {
              return 'router';
            }
            // Clerk - carga diferida
            if (id.includes('@clerk')) {
              return 'clerk';
            }
            // Editor TipTap - carga diferida (solo en /dashboard)
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'editor';
            }
            // Iconos - carga diferida
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Utilidades
            if (id.includes('date-fns') || id.includes('lodash')) {
              return 'utils';
            }
          }
        },
        // ⚡ Nombres de archivo con hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    chunkSizeWarningLimit: 500,
  },
  // ⚡ Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
