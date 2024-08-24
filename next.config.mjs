/** @type {import('next').NextConfig} */

import { withSentryConfig } from "@sentry/nextjs";
import withPWAConfig from "next-pwa";

// PWA configuration
const withPWA = withPWAConfig({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// Next.js configuration
const nextConfig = {
  rewrites: async () => {
    const { NEXT_PUBLIC_TIMETABLE_URL, NEXT_PUBLIC_CMS, NEXT_PUBLIC_HOST } =
      process.env;

    if (!NEXT_PUBLIC_TIMETABLE_URL || !NEXT_PUBLIC_HOST) {
      throw new Error(
        "Environment variables NEXT_PUBLIC_HOST and NEXT_PUBLIC_TIMETABLE_URL must be defined",
      );
    }

    const rewrites = [];

    if (NEXT_PUBLIC_CMS) {
      rewrites.push({
        source: "/proxy/cms/:path",
        destination: `${NEXT_PUBLIC_CMS}/api/:path`,
      });
    }

    return rewrites;
  },
};

// Apply the PWA configuration
const configuredNextConfig = withPWA(nextConfig);

// Sentry configuration
const sentryConfig = {
  org: "majrvy",
  project: "zstio-timetable",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const finalConfig = withSentryConfig(configuredNextConfig, sentryConfig);

export default finalConfig;
