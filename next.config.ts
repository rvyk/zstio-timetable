import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
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
