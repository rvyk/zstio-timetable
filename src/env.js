import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_SUPPRESS_TURBOPACK_WARNING: z.string().optional(),
    BUILD_STANDALONE: z.enum(["true", "false"]).optional(),
  },

  client: {
    NEXT_PUBLIC_TIMETABLE_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SCHOOL_NEWS_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_TIMETABLE_URL: process.env.NEXT_PUBLIC_TIMETABLE_URL,
    NEXT_PUBLIC_SCHOOL_NEWS_URL: process.env.NEXT_PUBLIC_SCHOOL_NEWS_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_SUPPRESS_TURBOPACK_WARNING:
      process.env.SENTRY_SUPPRESS_TURBOPACK_WARNING,
    BUILD_STANDALONE: process.env.BUILD_STANDALONE,
  },
});
