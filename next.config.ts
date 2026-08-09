import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./src/env";

// Service worker buduje `@serwist/turbopack` w src/app/serwist/[path]/route.ts.
// Nie owijamy configu w `@serwist/next` — ten nie wspiera Turbopacka i duplikowałby SW.
const nextConfig: NextConfig = {
  // Dockerfile kopiuje .next/standalone, więc budujemy je zawsze.
  output: "standalone",

  redirects: async () => [
    {
      source: "/zastepstwa/:path*",
      destination: "/",
      permanent: false,
    },
  ],
};

const sentryConfig = {
  org: "majrvy",
  project: "zstio-timetable",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  telemetry: false,
};

export default withSentryConfig(nextConfig, sentryConfig);
