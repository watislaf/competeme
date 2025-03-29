import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

import { vercelPreset } from "@vercel/remix/vite";

export default defineConfig({
  plugins: [
    envOnly(),
    tsconfigPaths(),
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    sentryVitePlugin({
      org: "competeme-0j",
      project: "competeme",
    }),
    sentryVitePlugin({
      org: "competeme-0j",
      project: "competeme",
    }),
  ],

  build: {
    sourcemap: true,
  },
});
