import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuração específica para produção
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Configurações otimizadas para produção
    sourcemap: false, // Não gerar sourcemaps em produção
    minify: 'esbuild', // Usar esbuild que é mais rápido
    esbuild: {
      drop: ['console', 'debugger'], // Remove console.log e debugger
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-toast'],
          supabase: ['@supabase/supabase-js'],
        },
        // Nomes de arquivos com hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Configurações de chunk
    chunkSizeWarningLimit: 1000,
    // Otimizações de CSS
    cssCodeSplit: true,
    // Configurações de assets
    assetsInlineLimit: 4096,
  },
  // Configurações de servidor (apenas para preview)
  preview: {
    port: 4173,
    host: true,
    headers: {
      // Headers de segurança para preview
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  // Configurações de define para produção
  define: {
    __DEV__: false,
    __PROD__: true,
  },
});
