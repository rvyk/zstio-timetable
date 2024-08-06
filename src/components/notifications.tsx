"use client";

import { useEffect } from "react";

const Notifications: React.FC = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    } else {
      console.log("Service Worker is not supported in this browser.");
    }
  }, []);

  return null;
};

export default Notifications;
