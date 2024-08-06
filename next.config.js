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
    const { NEXT_PUBLIC_TIMETABLE_URL, NEXT_PUBLIC_CMS } = process.env;

    if (!NEXT_PUBLIC_TIMETABLE_URL) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_TIMETABLE_URL must be defined",
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
