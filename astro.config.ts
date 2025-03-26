import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";


export default defineConfig({
  site: "https://mirislamus.github.io",
  base: "/mirislamus.github.io/",
  output: "static",
  integrations: [react(), sitemap()],
  server: {
    port: 3000,
    host: true,
  },
  vite: {
    resolve: {
      alias: {
        "@shared": "/src/shared",
        "@widgets": "/src/widgets",
        "@utils": "/src/utils",
      },
    },
    build: {
      minify: "esbuild",
      sourcemap: false,
    },
  },
});
