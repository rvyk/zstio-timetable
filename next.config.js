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
