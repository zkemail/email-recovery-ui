import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      common: path.resolve(__dirname, "src/common"),
      routes: path.resolve(__dirname, "src/routes"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
});
