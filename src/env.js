import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SENTRY_AUTH_TOKEN: z.string().optional(),
    DOCKERIZED: z.string().optional(),
    SENTRY_SUPPRESS_TURBOPACK_WARNING: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_TIMETABLE_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_TIMETABLE_URL: process.env.NEXT_PUBLIC_TIMETABLE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    DOCKERIZED: process.env.DOCKERIZED,
    SENTRY_SUPPRESS_TURBOPACK_WARNING: process.env.SENTRY_SUPPRESS_TURBOPACK_WARNING,
  },
});