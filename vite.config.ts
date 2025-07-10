import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    copyPublicDir: true,
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
      output: {
        // Manual chunk splitting for better caching and smaller bundles
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI library
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-tooltip'
          ],
          
          // 3D libraries (largest chunk)
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          
          // Animation libraries
          'animation-vendor': ['framer-motion', 'gsap', 'lottie-web'],
          
          // Form and data libraries
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data fetching and state
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          
          // Utility libraries
          'utils-vendor': [
            'date-fns',
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'lucide-react'
          ]
        },
        
        // Ensure JS files are generated with predictable names
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';
          const info = fileName.split('.');
          const ext = info[info.length - 1];
          
          // Handle videos separately to avoid hash for large files
          if (/\.(mp4|webm|ogv)$/i.test(fileName)) {
            return `assets/videos/[name].[ext]`;
          }
          
          // Handle CSS files
          if (/\.css$/i.test(fileName)) {
            return `assets/css/[name]-[hash].[ext]`;
          }
          
          // Handle images with hash
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(fileName)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          
          // Handle fonts
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(fileName)) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          
          // Default for other assets
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    }
  },
  server: {
    host: true,
    fs: {
      strict: false,
    },
    hmr: {
      overlay: false,
    },
  },
  // Prevent automatic service worker generation
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
