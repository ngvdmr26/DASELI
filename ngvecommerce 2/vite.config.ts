import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    root: __dirname,
    build: {
      outDir: path.resolve(__dirname, "../dist"),
      emptyOutDir: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.svg",
          "apple-touch-icon.png",
          "icon-192.png",
          "icon-512.png",
        ],
        manifest: {
          name: "DASELI - Premium Textile",
          short_name: "DASELI",
          description: "Premium home textile e-commerce application",
          theme_color: "#3D0D6B",
          background_color: "#FFFFFF",
          display: "standalone",
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
