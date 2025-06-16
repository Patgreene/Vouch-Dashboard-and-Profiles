import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Set the base URL for GitHub Pages deployment
  // Change this to your repository name: base: '/your-repo-name/'
  // For custom domain or root deployment, use: base: '/'
  base: mode === "production" ? "/your-repo-name/" : "/",

  server: {
    host: "::",
    port: 8080,
    // Enable SPA routing - serve index.html for all routes
    historyApiFallback: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimized build configuration
  build: {
    // Enable compression and minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production", // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        // Create separate chunks for better caching
        manualChunks: {
          // Vendor chunk for large libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI components chunk
          ui: [
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-accordion",
          ],
          // Utils and smaller libraries
          utils: ["clsx", "tailwind-merge", "date-fns"],
          // Supabase and data layer
          data: ["@supabase/supabase-js"],
        },
        // Better file naming for cache busting
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },

    // Optimize bundle size
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for smaller files

    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000,
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "lucide-react",
    ],
    exclude: ["@react-three/fiber", "three"], // Exclude heavy 3D libraries if not used
  },

  // Enable CSS optimization
  css: {
    devSourcemap: false,
  },
}));
