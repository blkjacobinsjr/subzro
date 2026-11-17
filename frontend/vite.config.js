import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cspIconCloud } from "./scripts/cspIconCloud.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [cspIconCloud(), react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ["axios", "react-icon-cloud"],
  },
});
