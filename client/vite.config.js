import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://royalpet.vercel.app").replace(/\/$/, "");

  return {
    plugins: [
      react(),
      {
        name: "site-meta",
        transformIndexHtml(html) {
          return html.replaceAll("__SITE_URL__", siteUrl);
        },
        closeBundle() {
          const dist = path.resolve(__dirname, "dist");
          for (const file of ["robots.txt", "sitemap.xml"]) {
            const src = path.resolve(__dirname, "public", file);
            if (!fs.existsSync(src)) continue;
            const out = fs.readFileSync(src, "utf8").replaceAll("__SITE_URL__", siteUrl);
            fs.writeFileSync(path.resolve(dist, file), out);
          }
        },
      },
    ],
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      globals: true,
    },
  };
});
