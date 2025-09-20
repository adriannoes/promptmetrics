
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Remove restrictive headers for development to prevent connection issues
    ...(mode === 'development' && {
      headers: {
        // Essential headers for development with external resources allowed
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https: wss: ws: *.lovable.dev *.gpteng.co; img-src 'self' data: https:; media-src 'self' https:; font-src 'self' data: https: fonts.googleapis.com fonts.gstatic.com; style-src 'self' 'unsafe-inline' https: fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: cdn.gpteng.co;",
      }
    })
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
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-toast'],
        },
      },
    },
  },
}));
