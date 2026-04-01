import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: '0.0.0.0',  // permite acceder desde fuera del contenedor
    watch: {
      usePolling: true,
      interval: 1000
    }
  }
})
