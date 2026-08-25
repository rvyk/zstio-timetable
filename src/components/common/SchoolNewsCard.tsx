"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useNewsStore } from "@/stores/news";
import { ArrowUpRight, Check, Megaphone } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";

export interface SchoolNewsPost {
  id: number;
  title: string;
  link: string;
  date: string;
}

const newsDate = (locale: Locale) =>
  new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "pl-PL", {
    day: "numeric",
    month: "long",
  });

const CONFIRM_MS = 700;

export const SchoolNewsCard: FC<SchoolNewsPost> = ({
  id,
  title,
  link,
  date,
}) => {
  const translate = useT();
  const locale = useLocale();
  const isRead = useNewsStore((state) => state.readId) >= id;
  const markRead = useNewsStore((state) => state.markRead);
  const [phase, setPhase] = useState<"idle" | "read" | "gone">("idle");
  const isMounted = useIsClient();

  useEffect(() => {
    if (phase !== "read") return;
    const timeout = setTimeout(() => setPhase("gone"), CONFIRM_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  if (!isMounted || (isRead && phase === "idle")) return null;

  const dismiss = () => {
    markRead(id);
    setPhase("read");
  };

  const parsedDate = new Date(date);

  return (
    <div
      className={cn(
        "ease-out-quint grid shrink-0 transition-all duration-300 motion-reduce:transition-none",
        phase === "gone"
          ? "-mb-3 grid-rows-[0fr] opacity-0"
          : "grid-rows-[1fr] opacity-100",
      )}
      aria-hidden={phase === "gone"}
      inert={phase === "gone"}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "border-lines bg-foreground animate-rise relative mx-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 shadow-(--shadow-soft) transition duration-300 md:mx-0",
            phase !== "idle" && "border-primary/15 scale-[0.99]",
          )}
        >
          {phase === "idle" ? (
            <Megaphone
              className="text-primary/40 size-4 shrink-0"
              strokeWidth={2}
            />
          ) : (
            <Check
              className="text-primary animate-pop size-4 shrink-0"
              strokeWidth={2.5}
            />
          )}

          <span className="grid min-w-0 flex-1 gap-0.5">
            <span
              className={cn(
                "truncate text-[13px] leading-tight font-medium transition-colors duration-300",
                phase === "idle" ? "text-primary" : "text-primary/45",
              )}
            >
              {title}
            </span>
            <span className="text-primary/40 truncate text-[11px] leading-tight">
              {phase === "idle" ? (
                <>
                  {translate("news.source")}
                  {!Number.isNaN(parsedDate.getTime()) &&
                    ` · ${newsDate(locale).format(parsedDate)}`}
                </>
              ) : (
                <span className="animate-rise inline-block">
                  {translate("news.read")}
                </span>
              )}
            </span>
          </span>

          {phase === "idle" && (
            <>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="group/link before:absolute before:inset-0 before:rounded-xl"
                aria-label={translate("news.open", { title })}
              >
                <ArrowUpRight
                  className="text-primary/35 size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
              <button
                onClick={dismiss}
                aria-label={translate("news.markRead")}
                title={translate("news.markRead")}
                className="text-primary/35 hover:bg-primary/5 hover:text-primary relative grid size-7 shrink-0 place-content-center rounded-md transition active:scale-90"
              >
                <Check className="size-4" strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
