"use client";

import { translationDict } from "@/constants/translates";
import { handleFavorite } from "@/lib/handle-favorites";
import { cn } from "@/lib/utils";
import logo_zstio from "@/resources/logo-zstio.png";
import { useFavoritesStore } from "@/stores/favorites-store";
import { OptivumTimetable } from "@/types/optivum";
import { ArrowLeftFromLine, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, Fragment, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { TopbarButtons } from "./buttons";

interface TopbarProps {
  timetable: OptivumTimetable;
}

export const Topbar: FC<TopbarProps> = ({ timetable }) => {
  const { favorites } = useFavoritesStore();
  const isClient = useIsClient();

  const isFavorite = useMemo(
    () => favorites.some((c) => c.name === timetable.title),
    [favorites, timetable.title],
  );

  const titleElement = useMemo(
    () =>
      timetable.title ? (
        <>
          Rozkład zajęć {translationDict[timetable.type]}{" "}
          <span className="font-semibold">{timetable.title}</span>
        </>
      ) : (
        "Nie znaleziono planu zajęć"
      ),
    [timetable.title, timetable.type],
  );

  return (
    <div className="flex w-full justify-between gap-x-4">
      <div className="grid gap-2">
        <SchoolLink />
        <div className="grid gap-1.5">
          <div className="inline-flex items-center gap-x-4">
            <h1 className="max-w-2xl truncate text-ellipsis text-3xl font-semibold leading-tight text-primary/90 xl:text-4.2xl">
              {titleElement}
            </h1>
            {timetable.title && isClient && (
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

const SchoolLink: FC = () => (
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

const Dates: FC<{ timetable: OptivumTimetable }> = ({ timetable }) => {
  const hasNoLessons = useMemo(
    () => timetable.lessons.some((innerArray) => innerArray.length === 0),
    [timetable.lessons],
  );

  const dateElements = useMemo(() => {
    if (hasNoLessons) return null;

    const elements = [];
    if (timetable.generatedDate && timetable.generatedDate !== "Invalid date") {
      elements.push(
        <Fragment key="generatedDate">
          Wygenerowano:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.generatedDate}
          </span>
        </Fragment>,
      );
    }
    if (timetable.validDate) {
      elements.push(
        <Fragment key="validDate">
          Obowiązuje od:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.validDate}
          </span>
        </Fragment>,
      );
    }

    return elements.reduce<(string | JSX.Element)[]>(
      (acc, curr, index, array) => {
        return index < array.length - 1 ? [...acc, curr, ", "] : [...acc, curr];
      },
      [],
    );
  }, [hasNoLessons, timetable.generatedDate, timetable.validDate]);

  return hasNoLessons ? (
    <p className="text-base font-medium text-primary/50">
      Szukany plan zajęć{" "}
      <span className="font-semibold text-primary/90">({timetable.id})</span>{" "}
      nie mógł zostać znaleziony.
    </p>
  ) : (
    <p className="text-sm font-medium text-primary/70 xl:text-base">
      {dateElements}
    </p>
  );
};
