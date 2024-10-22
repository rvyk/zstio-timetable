import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/zastepstwa",
        destination: "/substitutions",
      },
    ];
  },

  webpack: (config) => {
    checkEnvVariables(["NEXT_PUBLIC_TIMETABLE_URL", "NEXT_PUBLIC_APP_URL"]);

    return config;
  },
};

const checkEnvVariables = (envVars: string[]) => {
  envVars.forEach((envVar) => {
    const value = process.env[envVar];

    if (!value) {
      throw new Error(
        `Error: Missing required environment variable: ${envVar}`,
      );
    }

    if (envVar.endsWith("_URL")) {
      try {
        new URL(value);
      } catch {
        throw new Error(
          `Error: Environment variable ${envVar} is not a valid URL: ${value}`,
        );
      }
    }
  });
};

// export default nextConfig;

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
