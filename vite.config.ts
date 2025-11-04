import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'forms': ['react-hook-form'],
          'icons': ['lucide-react'],
          'table': ['react-data-table-component'],
        },
      },
    },
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: true,
  },
  server: {
    headers: {
      'Cache-Control': 'max-age=31536000',
    },
  },
});
