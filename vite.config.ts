import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/my-quiz-app/", // ⚠️ Double-check that it matches your repo name exactly
});
