import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
    }),
    Components({
      dirs: ['./components'], // 調整為你的組件目錄
      directoryAsNamespace: true, // 將目錄名稱作為命名空間
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
});