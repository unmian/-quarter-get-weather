/*
 * @Author: Quarter
 * @Date: 2021-12-29 07:28:23
 * @LastEditTime: 2022-05-07 10:51:47
 * @LastEditors: Quarter
 * @Description: vite 基础配置
 * @FilePath: /get-weather/build/dev.config.ts
 */
import { resolve } from "path";
import { defineConfig } from "vite";
import baseConfig from "./base.config";

// 文档: https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  server: {
    port: 8080,
    host: "0.0.0.0",
    strictPort: true,
    proxy: {
      "/caiyun": {
        target: "https://api.caiyunapp.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/caiyun/, ""),
      },
    },
  },
});