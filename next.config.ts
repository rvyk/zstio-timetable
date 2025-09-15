import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  output: process.env.DOCKERIZED === "true" ? "standalone" : undefined,

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
  disableLogger: true,
  automaticVercelMonitors: false,
  telemetry: false,
};

export default withSentryConfig(nextConfig, sentryConfig);
