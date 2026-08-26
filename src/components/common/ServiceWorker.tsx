"use client";

import { useFavoritesStore } from "@/stores/favorites";
import { useEffect } from "react";

const prefetched = new Set<string>();

const whenIdle = (callback: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(callback, { timeout: 5000 })
    : setTimeout(callback, 3000);

export const ServiceWorker = () => {
  const favorites = useFavoritesStore((state) => state.favorites);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/serwist/sw.js", { scope: "/", type: "module" })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || favorites.length === 0) return;

    const links = favorites
      .map((item) => `/${item.type ?? "class"}/${item.value}`)
      .filter((link) => !prefetched.has(link));

    if (links.length === 0) return;

    void navigator.serviceWorker.ready.then(() =>
      whenIdle(() => {
        if (!navigator.onLine) return;
        for (const link of links) {
          prefetched.add(link);
          void fetch(link).catch(() => prefetched.delete(link));
        }
      }),
    );
  }, [favorites]);

  return null;
};
