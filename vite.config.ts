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
    copyPublicDir: false,
    rollupOptions: {
      output: {
        // Ensure JS files are generated with predictable names
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';
          const info = fileName.split('.');
          const ext = info[info.length - 1];
          
          // Handle videos separately to avoid hash for large files
          if (/\.(mp4|webm|ogv)$/i.test(fileName)) {
            return `media/videos/[name].[ext]`;
          }
          
          // Handle images with hash
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(fileName)) {
            return `assets/images/[name]-[hash].[ext]`;
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
});
