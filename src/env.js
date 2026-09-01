import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_SUPPRESS_TURBOPACK_WARNING: z.string().optional(),
    BUILD_STANDALONE: z.enum(["true", "false"]).optional(),
    DISCORD_WEBHOOK_URL: z.string().url().optional(),
    PLAN_WATCH_SECRET: z.string().optional(),
    PLAN_SNAPSHOT_PATH: z.string().optional(),
    PLAN_WATCH_INTERVAL_MINUTES: z.coerce.number().int().min(1).optional(),
    REVALIDATE_URL: z.string().url().optional(),
  },

  client: {
    NEXT_PUBLIC_TIMETABLE_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SCHOOL_NEWS_URL: z.string().url().optional(),
    NEXT_PUBLIC_ALT_TIMETABLE_URL: z.string().url().optional(),
    NEXT_PUBLIC_DISABLE_ANALYTICS: z.enum(["true", "false"]).optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_TIMETABLE_URL: process.env.NEXT_PUBLIC_TIMETABLE_URL,
    NEXT_PUBLIC_SCHOOL_NEWS_URL: process.env.NEXT_PUBLIC_SCHOOL_NEWS_URL,
    NEXT_PUBLIC_ALT_TIMETABLE_URL: process.env.NEXT_PUBLIC_ALT_TIMETABLE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DISABLE_ANALYTICS: process.env.NEXT_PUBLIC_DISABLE_ANALYTICS,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_SUPPRESS_TURBOPACK_WARNING:
      process.env.SENTRY_SUPPRESS_TURBOPACK_WARNING,
    BUILD_STANDALONE: process.env.BUILD_STANDALONE,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    PLAN_WATCH_SECRET: process.env.PLAN_WATCH_SECRET,
    PLAN_SNAPSHOT_PATH: process.env.PLAN_SNAPSHOT_PATH,
    PLAN_WATCH_INTERVAL_MINUTES: process.env.PLAN_WATCH_INTERVAL_MINUTES,
    REVALIDATE_URL: process.env.REVALIDATE_URL,
  },
});
