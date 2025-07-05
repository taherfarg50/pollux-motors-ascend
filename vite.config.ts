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
    minify: true,
    copyPublicDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
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
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
