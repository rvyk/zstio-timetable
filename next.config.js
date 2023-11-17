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
    return [
      {
        source: "/api/getSubstitutions",
        destination: `${process.env.SUBSTITUTIONS_API || ""} `,
      },
      {
        source: "/proxy/getTimetable/:path",
        destination: `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/:path`,
      },
      {
        source: "/proxy/getTimetableList",
        destination: `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`,
      },
    ];
  },
});
