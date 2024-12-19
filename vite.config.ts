import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "./",

  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            // Define a runtime caching rule for JS modules
            urlPattern: /\.js$/, // Adjust the pattern to match your JS files
            handler: "NetworkFirst", // Change the handler to 'NetworkFirst' or 'StaleWhileRevalidate'
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
