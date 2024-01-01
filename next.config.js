/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

// @ts-ignore
module.exports = withPWA({
  reactStrictMode: false,
  images: {
    remotePatterns: [{ hostname: "zstiojar.edu.pl" }],
  },
  i18n: {
    locales: ["pl"],
    defaultLocale: "pl",
    localeDetection: false,
  },

  async rewrites() {
    const { NEXT_PUBLIC_TIMETABLE_URL, NEXT_PUBLIC_CMS, NEXT_PUBLIC_HOST } =
      process.env;

    if (!NEXT_PUBLIC_TIMETABLE_URL || !NEXT_PUBLIC_HOST) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_TIMETABLE_URL and NEXT_PUBLIC_HOST must be defined",
      );
    }

    const rewrites = [
      {
        source: "/proxy/getTimetable/:path",
        destination: `${NEXT_PUBLIC_TIMETABLE_URL}/plany/:path`,
      },
      {
        source: "/proxy/getTimetableList",
        destination: `${NEXT_PUBLIC_TIMETABLE_URL}/lista.html`,
      },
    ];

    if (NEXT_PUBLIC_CMS) {
      rewrites.push({
        source: "/proxy/cms/:path",
        destination: `${NEXT_PUBLIC_CMS}/api/:path`,
      });
    }

    return rewrites;
  },
});
