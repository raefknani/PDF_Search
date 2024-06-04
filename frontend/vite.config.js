import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Add the path to the directory where your PDF files are located
      allow: [
        "C:/Users/asusm/Documents/IndexationV3/projet-indexation/SearchEngineAR/frontend/src",
        "C:/Users/asusm/Documents/IndexationV3/projet-indexation/SearchEngineAR/backend/UploadedFiles",
      ],
    },
    proxy: {
      "/uploads": {
        target: "https://localhost:5000",
        changeOrigin: false,
        secure: false,
      },
    },
  },
});
