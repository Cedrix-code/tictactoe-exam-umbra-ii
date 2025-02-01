import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT || 4000,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
