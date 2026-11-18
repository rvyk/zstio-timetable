import { isTimetablePath, resolveRedirectPath } from "@/lib/lastVisited";
import {
  isSavedPage,
  REFRESH_PAGES_MESSAGE,
  SAVED_AT_ATTRIBUTE,
  SAVED_AT_HEADER,
  START_PATH_MESSAGE,
} from "@/lib/offline";
import { defaultCache, PAGES_CACHE_NAME } from "@serwist/turbopack/worker";
import type {
  PrecacheEntry,
  RuntimeCaching,
  SerwistGlobalConfig,
  SerwistPlugin,
} from "serwist";
import {
  disableNavigationPreload,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// @ts-expect-error - To find this type, in docs we use references, but it break other files in the project
declare const self: ServiceWorkerGlobalScope;

type WaitUntil = { waitUntil: (promise: Promise<unknown>) => void };

const NETWORK_TIMEOUT_SECONDS = 3;
const SAVED_PAGES_LIMIT = 64;
const START_PATH_CACHE = "start-path";

const stampSavedAt = async (response: Response) => {
  if (response.status !== 200 || response.redirected) return null;

  const savedAt = String(Date.now());
  const html = (await response.text()).replace(
    /<html\b/i,
    `<html ${SAVED_AT_ATTRIBUTE}="${savedAt}"`,
  );
  const headers = new Headers(response.headers);
  headers.set(SAVED_AT_HEADER, savedAt);
  headers.delete("content-length");

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const revalidatePage: SerwistPlugin = {
  requestWillFetch: async ({ request }) =>
    new Request(request.url, {
      headers: request.headers,
      credentials: request.credentials,
      redirect: request.redirect,
      cache: "no-cache",
    }),
};

const savedPageStamp: SerwistPlugin = {
  cacheWillUpdate: ({ response }) => stampSavedAt(response),
};

const startPathFallback: SerwistPlugin = {
  handlerDidError: async () => {
    const cache = await caches.open(START_PATH_CACHE);
    const saved = await cache.match("/");
    const path = saved ? await saved.text() : resolveRedirectPath();

    return Response.redirect(new URL(path, self.location.origin).href, 302);
  },
};

const offlineCaching: RuntimeCaching[] = [
  {
    matcher: ({ request, sameOrigin }) =>
      sameOrigin && request.headers.get("RSC") === "1",
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ request, url, sameOrigin }) =>
      sameOrigin && request.mode === "navigate" && url.pathname === "/",
    handler: new NetworkOnly({
      networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
      plugins: [startPathFallback],
    }),
  },
  {
    matcher: ({ url, sameOrigin }) => sameOrigin && isSavedPage(url.pathname),
    handler: new NetworkFirst({
      cacheName: PAGES_CACHE_NAME.html,
      networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
      plugins: [
        revalidatePage,
        savedPageStamp,
        new ExpirationPlugin({ maxEntries: SAVED_PAGES_LIMIT }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching:
    process.env.NODE_ENV === "production"
      ? [...offlineCaching, ...defaultCache]
      : defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.setCatchHandler(async ({ event }) => {
  if (
    event.request.destination === "document" ||
    event.request.mode === "navigate"
  ) {
    const offlineResponse = await serwist.matchPrecache("/~offline");
    if (offlineResponse) {
      return offlineResponse;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
  return Response.error();
});

const saveStartPath = async (path: unknown) => {
  if (typeof path !== "string" || !isTimetablePath(path)) return;

  const cache = await caches.open(START_PATH_CACHE);
  await cache.put("/", new Response(path));
};

const refreshSavedPages = async () => {
  const cache = await caches.open(PAGES_CACHE_NAME.html);
  const requests = await cache.keys();

  await Promise.all(
    requests.map(async (request) => {
      const response = await fetch(request.url, { cache: "no-cache" })
        .then(stampSavedAt)
        .catch(() => null);

      if (response) await cache.put(request, response);
    }),
  );
};

self.addEventListener("message", (event: MessageEvent & WaitUntil) => {
  if (event.data?.type === START_PATH_MESSAGE) {
    event.waitUntil(saveStartPath(event.data.path));
  }

  if (event.data?.type === REFRESH_PAGES_MESSAGE) {
    event.waitUntil(refreshSavedPages());
  }
});

self.addEventListener("activate", (event: Event & WaitUntil) => {
  event.waitUntil(
    Promise.all([
      caches.delete(PAGES_CACHE_NAME.rsc),
      caches.delete(PAGES_CACHE_NAME.rscPrefetch),
    ]),
  );
});

disableNavigationPreload();

serwist.addEventListeners();
