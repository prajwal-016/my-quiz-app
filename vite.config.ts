import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // 🎯 This forces ALL asset URLs to become relative to wherever they are hosted!
});
