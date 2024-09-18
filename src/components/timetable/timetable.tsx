"use client";

import { Button } from "@/components/ui/button";
import { translationDict } from "@/constants/translates";
import { cn, parseTime, simulateKeyPress } from "@/lib/utils";
import logo_zstio_high from "@/resources/logo-zstio-high.png";
import { useSettingsWithoutStore } from "@/stores/settings-store";
import { OptivumTimetable } from "@/types/optivum";
import { ArrowLeft, ArrowRight, Shrink } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
  ShortLessonSwitcherCell,
  TableHeaderCell,
  TableHourCell,
} from "./cells";
import { TableLessonCell } from "./lessons";

export const Timetable: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable }) => {
  const isFullscreenMode =
    useSettingsWithoutStore((state) => state.isFullscreenMode) ?? false;

  const [currentTime, setCurrentTime] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLessonIndex = useMemo(() => {
    return Object.entries(timetable.hours || {}).findIndex(([, value]) => {
      const start = parseTime(value.timeFrom);
      const end = parseTime(value.timeTo);
      return currentTime >= start && currentTime < end;
    });
  }, [timetable.hours, currentTime]);

  return (
    <div
      className={cn(
        isFullscreenMode
          ? "fixed left-0 top-0 z-40 h-full min-h-screen w-screen rounded-none"
          : "h-fit w-full rounded-md",
        "overflow-hidden border border-lines bg-foreground transition-all",
      )}
    >
      <div className="h-full w-full overflow-auto">
        {timetable?.lessons.some((innerArray) => innerArray.length > 0) ? (
          <table className="w-full">
            <thead>
              <tr className="divide-x divide-lines border-b border-lines">
                <ShortLessonSwitcherCell />
                {timetable?.dayNames.map((dayName) => (
                  <TableHeaderCell key={dayName} dayName={dayName} />
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(timetable.hours)
                .map(([, value]) => value)
                .map((hour, lessonIndex) => (
                  <tr
                    key={lessonIndex}
                    className={cn(
                      isFullscreenMode ? "" : "last:border-none",
                      "divide-x divide-lines border-b border-lines odd:bg-accent/50 odd:dark:bg-background",
                    )}
                  >
                    <TableHourCell
                      hour={hour}
                      isCurrent={lessonIndex === currentLessonIndex}
                      timeRemaining={parseTime(hour.timeTo) - currentTime}
                    />
                    {timetable?.lessons.map((day, dayIndex) => (
                      <TableLessonCell
                        key={dayIndex}
                        day={day}
                        lessonIndex={lessonIndex}
                      />
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          isFullscreenMode && <NotFoundTimetable {...{ timetable }} />
        )}
      </div>
      {isFullscreenMode && <FullScreenControlls {...{ timetable }} />}
    </div>
  );
};

const FullScreenControlls: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable: { title, type } }) => {
  const toggleFullscreenMode = useSettingsWithoutStore(
    (state) => state.toggleFullscreenMode,
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 grid w-full place-content-center">
      <div className="flex items-center justify-center gap-x-4 opacity-20 hover:opacity-100">
        <Button
          aria-label="Poprzednia klasa/nauczyciel/sala"
          variant="icon"
          size="icon"
          onClick={() => simulateKeyPress("ArrowLeft", 37)}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Button>
        <div className="flex h-14 min-w-96 items-center justify-between gap-x-2 rounded-md border border-lines bg-accent pl-4 pr-2 dark:border-primary/10">
          <h1 className="max-w-xs truncate text-ellipsis text-lg font-medium text-primary/90">
            {title ? (
              <React.Fragment>
                Rozkład zajęć {translationDict[type]}{" "}
                <span className="font-semibold">{title}</span>
              </React.Fragment>
            ) : (
              "Nie znaleziono planu zajęć"
            )}
          </h1>

          <Button
            aria-label="Wyjdź z trybu pełnoekranowego"
            variant="icon"
            size="icon"
            onClick={toggleFullscreenMode}
          >
            <Shrink size={20} strokeWidth={2.5} />
          </Button>
        </div>
        <Button
          aria-label="Następna klasa/nauczyciel/sala"
          variant="icon"
          size="icon"
          onClick={() => simulateKeyPress("ArrowRight", 39)}
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};

const NotFoundTimetable: React.FC<{
  timetable: OptivumTimetable;
}> = ({ timetable: { id } }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src={logo_zstio_high}
        alt="Logo szkoły ZSTiO"
        className="aspect-square w-24"
      />
      <div className="grid gap-1 text-center">
        <h1 className="text-3xl font-semibold text-primary/90">
          Nie znaleziono planu zajęć
        </h1>
        <p className="text-base font-medium text-primary/50">
          Szukany plan zajęć{" "}
          <span className="font-semibold text-primary/90">({id})</span> nie mógł
          zostać znaleziony.
        </p>
      </div>
    </div>
  );
};
