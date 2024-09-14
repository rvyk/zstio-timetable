"use client";

import { translationDict } from "@/constants/translates";
import { handleFavorite } from "@/lib/handle-favorites";
import { cn } from "@/lib/utils";
import logo_zstio from "@/resources/logo-zstio.png";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useSettingsWithoutStore } from "@/stores/settings-store";
import { OptivumTimetable } from "@/types/optivum";
import {
  ArrowLeftFromLine,
  Fullscreen,
  Menu,
  MoonIcon,
  Repeat2,
  StarIcon,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useIsClient } from "usehooks-ts";
import { Button } from "./ui/button";

export const Topbar: React.FC<{ timetable: OptivumTimetable }> = ({
  timetable,
}) => {
  const { favorites } = useFavoritesStore();
  const isClient = useIsClient();

  const timetableTitle = timetable?.title;
  const shortenedTitle =
    timetableTitle && timetableTitle.length > 16
      ? `${timetableTitle.slice(0, 16)}...`
      : timetableTitle;

  const isFavorite = favorites.some((c) => c.name === timetableTitle);

  return (
    <div className="flex w-full justify-between gap-x-4">
      <div className="grid gap-3">
        <SchoolLink />
        <div className="grid gap-2.5">
          <div className="inline-flex items-center gap-x-4">
            <h1 className="text-3xl font-semibold text-primary/90 xl:text-4.2xl">
              {timetableTitle ? (
                <>
                  Rozkład zajęć {translationDict[timetable.type]}{" "}
                  <span className="font-semibold">{shortenedTitle}</span>
                </>
              ) : (
                "Nie znaleziono planu zajęć"
              )}
            </h1>
            {timetableTitle && isClient && (
              <button
                aria-label={
                  isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                }
                onClick={handleFavorite}
                className="focus:outline-none"
              >
                <StarIcon
                  size={24}
                  strokeWidth={2.5}
                  className={cn(
                    isFavorite
                      ? "!fill-star !drop-shadow-[0_0_5.6px_rgba(255,196,46,0.35)]"
                      : "hover:fill-star",
                    "fill-transparent stroke-star drop-shadow-none transition-all",
                  )}
                />
              </button>
            )}
          </div>
          <Dates timetable={timetable} />
        </div>
      </div>
      <TopbarButtons />
    </div>
  );
};

const SchoolLink: React.FC = () => (
  <Link
    href="https://zstiojar.edu.pl"
    className="group inline-flex w-fit items-center gap-x-4"
  >
    <Image
      src={logo_zstio}
      alt="Logo szkoły ZSTiO"
      className="aspect-square w-10"
    />
    <div className="inline-flex items-center gap-x-2 text-primary/70 transition-colors group-hover:text-primary/90">
      <ArrowLeftFromLine size={20} strokeWidth={2.5} />
      <p className="text-base font-medium">Wróć na stronę szkoły</p>
    </div>
  </Link>
);

const Dates: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable }) => {
  return (
    <p className="text-sm font-medium text-primary/70 xl:text-base">
      {[
        timetable.generatedDate &&
          timetable.generatedDate != "Invalid date" && (
            <React.Fragment key="generatedDate">
              Wygenerowano:{" "}
              <span className="font-semibold text-primary/90">
                {timetable.generatedDate}
              </span>
            </React.Fragment>
          ),
        timetable.validDate && (
          <React.Fragment key="validDate">
            Obowiązuje od:{" "}
            <span className="font-semibold text-primary/90">
              {timetable.validDate}
            </span>
          </React.Fragment>
        ),
      ]
        .filter((item): item is JSX.Element => Boolean(item))
        .reduce<(string | JSX.Element)[]>((acc, curr, index, array) => {
          if (index < array.length - 1) {
            return [...acc, curr, ", "];
          } else {
            return [...acc, curr];
          }
        }, [])}
    </p>
  );
};

const TopbarButtons: React.FC = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const toggleFullscreenMode = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );

  const isClient = useIsClient();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "light" ? "dark" : "light");
      return;
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const buttons = [
    {
      icon: Fullscreen,
      href: null,
      action: toggleFullscreenMode,
      show: true,
    },
    {
      icon: theme === "dark" && isClient ? SunMedium : MoonIcon,
      href: null,
      action: toggleTheme,
      show: resolvedTheme || !isClient,
    },
    {
      icon: Repeat2,
      href: "/zastepstwa",
      action: null,
      show: true,
    },
    {
      icon: Menu,
      href: null,
      action: () => {},
      show: true,
    },
  ];

  return (
    <div className="inline-flex gap-2.5">
      {buttons.map((button, index) => (
        <Button
          aria-label="Przycisk nawigacyjny"
          key={index}
          variant="icon"
          size="icon"
          className={cn(!button.show && "hidden")}
          onClick={button.action ?? (() => {})}
          asChild={button.href !== null}
        >
          {button.href !== null ? (
            <Link aria-label="Link nawigacyjny" href={button.href}>
              <button.icon size={20} strokeWidth={2.5} />
            </Link>
          ) : (
            <button.icon size={20} strokeWidth={2.5} />
          )}
        </Button>
      ))}
    </div>
  );
};
