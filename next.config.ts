import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./src/env";

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
