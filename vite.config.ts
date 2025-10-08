
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

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
    mode === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@vite/client', '@vite/env'],
  },
  build: {
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    minify: 'esbuild', // Use esbuild for faster builds
    target: 'esnext', // Use modern JS features
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('class-variance-authority')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack/react-query') || id.includes('@supabase')) {
              return 'data-vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return '3d-vendor';
            }
            if (id.includes('recharts') || id.includes('date-fns')) {
              return 'charts-vendor';
            }
            return 'vendor';
          }
          // Application chunks
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/components/admin/')) {
            return 'admin-components';
          }
          if (id.includes('/src/components/demo/') || id.includes('/src/components/live/')) {
            return 'analysis-components';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Aggressive tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      onwarn(warning, warn) {
        // Custom performance warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          console.warn('⚠️  Circular dependency detected:', warning.message);
        }
        warn(warning);
      }
    },
    // Performance optimizations
    chunkSizeWarningLimit: 600, // Increase limit for better chunking
    cssCodeSplit: true, // Split CSS into separate chunks
    assetsInlineLimit: 4096, // Inline small assets
    reportCompressedSize: false, // Speed up builds
  },
  // ESBuild optimizations
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
  },
}));
