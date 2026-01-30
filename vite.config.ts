import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Allow access via tunnel domains (ngrok/cloudflared), otherwise Vite can block unknown Host headers.
    // Vite accepts `true` to allow all hosts.
    allowedHosts: true,
    watch: {
      usePolling: true,
    },
    // So we only need ONE public URL (ngrok/cloudflared) on the frontend.
    // Requests to /api/* are proxied to the backend container.
    proxy: {
      "/api": {
        target: process.env.VITE_DEV_PROXY_TARGET ?? "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
