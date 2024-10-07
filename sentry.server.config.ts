// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://006dba462eafc38ddbabf4386920564f@o4507831829594112.ingest.de.sentry.io/4507831831560272",
  enabled: process.env.NODE_ENV === "production",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
