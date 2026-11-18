"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { SAVED_AT_ATTRIBUTE } from "@/lib/offline";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const PROBE_TIMEOUT = 5000;
const MAX_RETRY_DELAY = 30000;
const RESTORED_MS = 3000;

const subscribeOnline = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const subscribeNothing = () => () => {};

const readSavedAt = () =>
  Number(document.documentElement.getAttribute(SAVED_AT_ATTRIBUTE)) || null;

const isReachable = () =>
  fetch(location.pathname, {
    method: "HEAD",
    cache: "no-store",
    signal: AbortSignal.timeout(PROBE_TIMEOUT),
  }).then(
    (response) => response.ok,
    () => false,
  );

const formatSavedAt = (savedAt: number, locale: Locale) => {
  const date = new Date(savedAt);
  const isToday = date.toDateString() === new Date().toDateString();

  return new Intl.DateTimeFormat(locale, {
    ...(!isToday && { day: "numeric", month: "short" }),
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const ConnectionStatus = () => {
  const translate = useT();
  const locale = useLocale();
  const router = useRouter();
  const isFallback = useSelectedLayoutSegments().includes("~offline");

  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
  const savedAt = useSyncExternalStore(
    subscribeNothing,
    readSavedAt,
    () => null,
  );

  const [dropped, setDropped] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [restored, setRestored] = useState(false);

  const savedLabel =
    savedAt !== null && !refreshed ? formatSavedAt(savedAt, locale) : null;
  const offline = !online || dropped || isFallback || savedLabel !== null;
  const visible = (offline && !isFallback) || restored;

  useEffect(() => {
    const markDropped = () => {
      setDropped(true);
      setRestored(false);
    };
    window.addEventListener("offline", markDropped);
    return () => window.removeEventListener("offline", markDropped);
  }, []);

  useEffect(() => {
    if (!online || !offline) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const check = async (attempt: number) => {
      const reachable = await isReachable();
      if (cancelled) return;

      if (reachable) {
        router.refresh();
        setDropped(false);
        setRefreshed(true);
        setRestored(true);
        return;
      }

      timeout = setTimeout(
        () => void check(attempt + 1),
        Math.min(2000 * 2 ** attempt, MAX_RETRY_DELAY),
      );
    };

    void check(0);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [online, offline, router]);

  useEffect(() => {
    if (!restored) return;
    const timeout = setTimeout(() => setRestored(false), RESTORED_MS);
    return () => clearTimeout(timeout);
  }, [restored]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-50 print:hidden"
    >
      {visible && (
        <div
          data-connection-bar=""
          className={cn(
            "flex h-[calc(1.75rem+env(safe-area-inset-top))] items-center justify-center gap-1.5 px-4 pt-[env(safe-area-inset-top)] text-[13px] text-white",
            offline && !restored
              ? "bg-accent-table dark:bg-[color-mix(in_oklab,var(--color-accent-table)_75%,black)]"
              : "bg-accent-success dark:bg-[color-mix(in_oklab,var(--color-accent-success)_60%,black)]",
          )}
        >
          {offline && !restored ? (
            <>
              <WifiOff className="size-3.5 shrink-0" strokeWidth={2.25} />
              <span className="font-semibold whitespace-nowrap">
                {translate("connection.offline")}
              </span>
              {savedLabel !== null && (
                <span className="truncate opacity-85">
                  · {translate("connection.savedAt", { time: savedLabel })}
                </span>
              )}
            </>
          ) : (
            <>
              <Wifi className="size-3.5 shrink-0" strokeWidth={2.25} />
              <span className="font-semibold whitespace-nowrap">
                {translate("connection.restored")}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
