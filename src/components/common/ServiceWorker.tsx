"use client";

import { useEffect } from "react";

/**
 * Rejestracja service workera. Zamiast `SerwistProvider`, bo tamten robił
 * `void register()` (odrzucenie leciało do Sentry przy każdej przeglądarce
 * bez SW, na preview za auth-redirectem itd.) i podmieniał
 * `history.pushState`, co przy drugim wrapperze kończyło się rekurencją.
 */
export const ServiceWorker = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/serwist/sw.js", { scope: "/", type: "module" })
      .catch(() => {
        // Brak SW = brak trybu offline. Aplikacja działa dalej.
      });
  }, []);

  return null;
};
