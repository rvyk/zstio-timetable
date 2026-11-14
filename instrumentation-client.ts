import { captureError } from "@/lib/errorQueue";

type SentryClient = typeof import("@/lib/sentryClient");

let sentry: SentryClient | undefined;

const captureEarly = (event: ErrorEvent | PromiseRejectionEvent) => {
  const error = "reason" in event ? event.reason : event.error;
  if (error === undefined || error === null) return;

  captureError(error, {
    mechanism: {
      type: "reason" in event ? "onunhandledrejection" : "onerror",
      handled: false,
    },
  });
};

window.addEventListener("error", captureEarly);
window.addEventListener("unhandledrejection", captureEarly);

const loadSentry = () =>
  import("@/lib/sentryClient").then((client) => {
    window.removeEventListener("error", captureEarly);
    window.removeEventListener("unhandledrejection", captureEarly);
    client.startSentry();
    sentry = client;
  });

const whenIdle = (callback: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(callback, { timeout: 5000 })
    : setTimeout(callback, 2000);

const scheduleSentry = () =>
  setTimeout(() => whenIdle(() => void loadSentry()), 5000);

if (document.readyState === "complete") scheduleSentry();
else window.addEventListener("load", scheduleSentry, { once: true });

export const onRouterTransitionStart: SentryClient["captureRouterTransitionStart"] =
  (...args) => sentry?.captureRouterTransitionStart(...args);
