// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { isOurError } from "@/lib/sentryFilter";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://006dba462eafc38ddbabf4386920564f@o4507831829594112.ingest.de.sentry.io/4507831831560272",
  enabled: process.env.NODE_ENV === "production",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Noise from the user's environment, not from us: page translators mutating
  // the DOM under React, flaky service worker script fetches, and Android
  // WebView tearing down its JS bridge mid-session.
  ignoreErrors: [
    "The node to be removed is not a child of this node",
    "The node before which the new node is to be inserted is not a child of this node",
    "Failed to register a ServiceWorker",
    "Java object is gone",
  ],

  beforeSend: (event) =>
    isOurError(
      event.exception?.values?.flatMap(
        (value) =>
          value.stacktrace?.frames?.map((frame) => frame.filename) ?? [],
      ) ?? [],
    )
      ? event
      : null,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
