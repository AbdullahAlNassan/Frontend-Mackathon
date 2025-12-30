import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Load Vite env vars from the project root (so `Mackathon_project/.env` works),
  // instead of requiring a `.env` inside `frontend/Frontend-Mackathon`.
  envDir: path.resolve(__dirname, "..", ".."),
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
