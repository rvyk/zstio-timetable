"use client";

import { resolveRedirectPath } from "@/lib/lastVisited";
import {
  isSavedPage,
  REFRESH_PAGES_MESSAGE,
  START_PATH_MESSAGE,
} from "@/lib/offline";
import {
  DEFAULT_PLAN_COOKIE,
  favoritePath,
  useFavoritesStore,
} from "@/stores/favorites";
import { getCookie } from "cookies-next/client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const saved = new Set<string>();

const whenIdle = (callback: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(callback, { timeout: 5000 })
    : setTimeout(callback, 3000);

const postToWorker = (message: { type: string; path?: string }) =>
  navigator.serviceWorker.ready.then((registration) =>
    registration.active?.postMessage(message),
  );

const savePages = (links: string[]) =>
  navigator.serviceWorker.ready.then(() =>
    whenIdle(() => {
      if (!navigator.onLine) return;
      for (const link of links) {
        if (saved.has(link)) continue;
        saved.add(link);
        void fetch(link).catch(() => saved.delete(link));
      }
    }),
  );

export const ServiceWorker = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const defaultPath = useFavoritesStore((state) => state.defaultPath);
  const pathname = usePathname();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/serwist/sw.js", { scope: "/", type: "module" })
      .catch(() => {});

    const refreshSavedPages = () =>
      void postToWorker({ type: REFRESH_PAGES_MESSAGE });

    const saveAgain = () => {
      saved.clear();
      const links = useFavoritesStore.getState().favorites.map(favoritePath);
      if (isSavedPage(location.pathname)) links.unshift(location.pathname);
      void savePages(links);
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      refreshSavedPages,
    );
    window.addEventListener("online", saveAgain);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        refreshSavedPages,
      );
      window.removeEventListener("online", saveAgain);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || favorites.length === 0) return;

    void savePages(favorites.map(favoritePath));
  }, [favorites]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void postToWorker({
      type: START_PATH_MESSAGE,
      path: resolveRedirectPath(
        getCookie(DEFAULT_PLAN_COOKIE),
        getCookie("lastVisited"),
      ),
    });
  }, [pathname, defaultPath]);

  return null;
};
