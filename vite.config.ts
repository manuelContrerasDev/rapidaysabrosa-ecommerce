// vite.config.ts
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// Definir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 IMPORTANTE para Vercel + React Router
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias para imports limpios
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Mantener exclusión
  },
  build: {
    outDir: 'dist',        // Carpeta de build final
    sourcemap: false,      // No exponer source maps en producción
    minify: 'esbuild',     // Minificación rápida
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          framer: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,            // Abre navegador automáticamente
  },
  preview: {
    port: 4173,
  },
});
