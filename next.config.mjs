/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  webpack: (config) => {
    checkEnvVariables(["NEXT_PUBLIC_TIMETABLE_URL", "NEXT_PUBLIC_APP_URL"]);

    return config;
  },
};

const checkEnvVariables = (envVars) => {
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

export default nextConfig;
