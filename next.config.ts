import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./src/env";

const PAGE_PATH = "/:path((?!api/|serwist/|_next/|_vercel/).*)";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  poweredByHeader: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  redirects: async () => [
    {
      source: "/zastepstwa/:path*",
      destination: "/",
      permanent: false,
    },
  ],

  rewrites: async () => [
    {
      source: PAGE_PATH,
      has: [{ type: "cookie", key: "lang", value: "uk" }],
      destination: "/uk/:path",
    },
    { source: PAGE_PATH, destination: "/pl/:path" },
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
