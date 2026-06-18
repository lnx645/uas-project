import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import twvite from "@tailwindcss/vite"
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),twvite()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "../src/main/resources/static",
    emptyOutDir: true,
    
    rollupOptions: {    external: ['bootstrap/dist/css/bootstrap.min.css'],

      output: {
        // Mengatur nama file JS utama agar tidak pakai hash (misal: app_entry.js)
        entryFileNames: "js/[name].js",
        // Mengatur nama file chunk JS jika ada (tetap disatukan)
        chunkFileNames: "js/[name].js",
        // Mengatur nama file aset non-JS seperti CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "css/app_entry.[ext]"; // Menjadi css/app_entry.css
          }
          return "assets/[name].[ext]";
        },
        // Meminimalkan pembuatan chunk tambahan (memaksa jadi satu)
        manualChunks: undefined,
      },
    },
  },
});
