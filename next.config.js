/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    const { NEXT_PUBLIC_TIMETABLE_URL, NEXT_PUBLIC_CMS, NEXT_PUBLIC_HOST } =
      process.env;

    if (!NEXT_PUBLIC_TIMETABLE_URL || !NEXT_PUBLIC_HOST) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_TIMETABLE_URL and NEXT_PUBLIC_HOST must be defined"
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

module.exports = nextConfig;
