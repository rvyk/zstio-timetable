/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["zstiojar.edu.pl"],
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
        destination: `http://localhost:3001/api/getSubstitutions`,
      },
    ];
  },
  output: "standalone",
});
