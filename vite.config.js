import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/admin/", // Đặt base là root để tránh lỗi đường dẫn trên cPanel
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.split("node_modules/")[1].split("/")[0];
          }
        },
      },
    },
    emptyOutDir: true, // Xóa thư mục cũ trước khi build
    chunkSizeWarningLimit: 1000,
  },
});
