import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: true, // Make sure HMR (Hot Module Replacement) is enabled
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    (mode === 'development' || mode === 'preview') && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/frontend/src"),
      "@components": path.resolve(__dirname, "./apps/frontend/src/components"),
      "@pages": path.resolve(__dirname, "./apps/frontend/src/pages"),
      "@lib": path.resolve(__dirname, "./apps/frontend/src/lib"),
      "@utils": path.resolve(__dirname, "./apps/frontend/src/utils"),
      "@contexts": path.resolve(__dirname, "./apps/frontend/src/contexts"),
      "@hooks": path.resolve(__dirname, "./apps/frontend/src/hooks"),
      "@services": path.resolve(__dirname, "./apps/frontend/src/services"),
      "@types": path.resolve(__dirname, "./apps/frontend/src/types")
    },
  },
  define: {
    // This enables compatibility with packages that use process.env
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
  // Increase build performance and manage memory usage
  build: {
    sourcemap: true, // Enable sourcemaps for debugging
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          charts: ['recharts'],
          motion: ['framer-motion']
        }
      }
    }
  },
  preview: {
    port: 8080,
    host: true,
  }
}));
