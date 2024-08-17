/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  rewrites: async () => {
    const { NEXT_PUBLIC_TIMETABLE_URL, NEXT_PUBLIC_CMS, NEXT_PUBLIC_HOST } =
      process.env;

    if (!NEXT_PUBLIC_TIMETABLE_URL || !NEXT_PUBLIC_HOST) {
      throw new Error(
        "Environment variables NEXT_PUBLIC_HOST an NEXT_PUBLIC_TIMETABLE_URL must be defined",
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

module.exports = withPWA(nextConfig);

// Injected content via Sentry wizard below

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "zstio-timetable",
  project: "zstio-timetable",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
