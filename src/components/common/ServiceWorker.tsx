"use client";

import { useEffect } from "react";

export const ServiceWorker = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/serwist/sw.js", { scope: "/", type: "module" })
      .catch(() => {});
  }, []);

  return null;
};
