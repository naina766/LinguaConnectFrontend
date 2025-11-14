import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },

  // 🚀 FIX for Vercel build failures
  optimizeDeps: {
    exclude: ["docx", "jspdf"],
  },
  ssr: {
    noExternal: ["docx", "jspdf"],
  },

  server: {
    port: 3000,
    open: true,
  },
});
