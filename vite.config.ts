
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Relaxed headers for development to prevent connection issues
    ...(mode === 'development' && {
      headers: {
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https: wss: ws:; img-src 'self' data: https: blob:; media-src 'self' https: data:; font-src 'self' data: https:;",
      }
    })
  },
  preview: {
    host: "::",
    port: 8080,
    strictPort: true,
    // No CSP for preview mode to ensure compatibility with Lovable
    headers: {},
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/tests/setup.ts'],
    css: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
    exclude: ['@react-three/fiber', 'three'],
  },
  build: {
    sourcemap: false,
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // UI components and Radix
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          // Supabase and auth
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'data-vendor';
          }
          // Large libraries
          if (id.includes('framer-motion') || id.includes('@react-three')) {
            return 'animation-vendor';
          }
          // Everything else in node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: (chunkInfo) => {
          return chunkInfo.name === 'index' ? '[name]-[hash].js' : '[name]-[hash].js';
        },
        assetFileNames: '[name]-[hash][extname]',
      },
    },
    assetsInlineLimit: 4096,
  },
}));
