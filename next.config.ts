import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.DOCKERIZED === "true" ? "standalone" : undefined,

  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 60,
    },
    reactCompiler: true,
  },

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

const sentryConfig = {
  org: "majrvy",
  project: "zstio-timetable",

  silent: !process.env.CI,

  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: false,
  telemetry: false,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true
  }
};

export default withSentryConfig(nextConfig, sentryConfig);
