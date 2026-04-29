import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// @ts-expect-error - To find this type, in docs we use references, but it break other files in the project
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
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

serwist.addEventListeners();
