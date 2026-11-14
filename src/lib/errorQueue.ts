import type * as SentryModule from "@sentry/nextjs";

type Hint = Parameters<typeof SentryModule.captureException>[1];

let sentry: typeof SentryModule | undefined;
const queue: [unknown, Hint][] = [];

export const captureError = (error: unknown, hint?: Hint) => {
  if (sentry) sentry.captureException(error, hint);
  else queue.push([error, hint]);
};

export const flushErrors = (module: typeof SentryModule) => {
  sentry = module;
  queue
    .splice(0)
    .forEach(([error, hint]) => module.captureException(error, hint));
};
