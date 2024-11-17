"use client";

import school_logo_high from "@/assets/school-logo-high.png";
import { Button } from "@/components/ui/Button";
import { SHORT_HOURS } from "@/constants/settings";
import { translationDict } from "@/constants/translations";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import { cn, simulateKeyPress } from "@/lib/utils";
import { useSettingsStore, useSettingsWithoutStore } from "@/stores/settings";
import { OptivumTimetable } from "@/types/optivum";
import { ArrowLeft, ArrowRight, Shrink } from "lucide-react";
import Image from "next/image";
import { FC, Fragment, useMemo } from "react";
import {
  ShortLessonSwitcherCell,
  TableHeaderCell,
  TableHeaderMobileCell,
  TableHourCell,
} from "./Cells";
import { TableLessonCell } from "./LessonCells";
import { SCHOOL_SHORT } from "@/constants/school";

interface TimetableProps {
  timetable: OptivumTimetable;
}

export const Timetable: FC<TimetableProps> = ({ timetable }) => {
  const isFullscreenMode = useSettingsWithoutStore(
    (state) => state.isFullscreenMode,
  );
  const lessonType = useSettingsStore((state) => state.lessonType);
  const hoursAdjustIndex = useSettingsStore((state) => state.hoursAdjustIndex);
  const selectedDayIndex = useSettingsWithoutStore(
    (state) => state.selectedDayIndex,
  );
  const setSelectedDayIndex = useSettingsWithoutStore(
    (state) => state.setSelectedDayIndex,
  );

  const hours = useMemo(() => {
    if (lessonType === "custom") {
      return adjustShortenedLessons(
        hoursAdjustIndex,
        Object.values(timetable.hours),
      );
    }
    return lessonType === "short" ? SHORT_HOURS : timetable.hours;
  }, [lessonType, hoursAdjustIndex, timetable.hours]);

  const maxLessons = useMemo(() => {
    return (
      Math.max(
        Object.keys(timetable.hours).length,
        ...(timetable.lessons?.map((day) => day.length) ?? []),
      ) || 0
    );
  }, [timetable]);

  const hasLessons = useMemo(
    () => timetable.lessons?.some((innerArray) => innerArray.length > 0),
    [timetable.lessons],
  );

  const handleDayChange = (newIndex: number) => {
    if (selectedDayIndex !== newIndex) {
      setSelectedDayIndex(newIndex);
    }
  };

  return (
    <div
      className={cn(
        isFullscreenMode
          ? "fixed left-0 top-0 z-40 h-full min-h-screen w-screen rounded-none"
          : "h-fit w-full md:rounded-md",
        "border-lines bg-foreground transition-all max-md:mb-20 md:overflow-hidden md:border",
      )}
    >
      <div className="sticky top-0 z-20 flex justify-between divide-x divide-lines border-y border-lines bg-foreground md:hidden">
        {timetable.dayNames.map((dayName) => (
          <TableHeaderMobileCell
            key={dayName}
            dayName={dayName}
            selectedDayIndex={selectedDayIndex}
            setSelectedDayIndex={handleDayChange}
          />
        ))}
      </div>

      <div className="h-full w-full md:overflow-auto">
        {hasLessons ? (
          <table className="w-full">
            <thead className="max-md:hidden">
              <tr className="divide-x divide-lines border-b border-lines">
                <th>
                  <ShortLessonSwitcherCell />
                </th>
                {timetable.dayNames.map((dayName) => (
                  <TableHeaderCell key={dayName} dayName={dayName} />
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(hours)
                .slice(0, maxLessons)
                .map((hour, hourIndex) => (
                  <tr
                    key={hourIndex}
                    className={cn(
                      isFullscreenMode ? "" : "md:last:border-none",
                      "divide-lines border-b border-lines odd:bg-accent/50 odd:dark:bg-background md:divide-x",
                    )}
                  >
                    <TableHourCell hour={hour} />
                    {timetable.lessons?.map((day, dayIndex) => (
                      <TableLessonCell
                        key={dayIndex}
                        dayIndex={dayIndex}
                        day={day}
                        lessonIndex={hourIndex}
                        selectedDayIndex={selectedDayIndex}
                      />
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          isFullscreenMode && <NotFoundTimetable id={timetable.id} />
        )}
      </div>
      {isFullscreenMode && (
        <FullScreenControls title={timetable.title} type={timetable.type} />
      )}
    </div>
  );
};

interface FullScreenControlsProps {
  title: string;
  type: OptivumTimetable["type"];
}

const FullScreenControls: FC<FullScreenControlsProps> = ({ title, type }) => {
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
              <Fragment>
                Rozkład zajęć {translationDict[type]}{" "}
                <span className="font-semibold">{title}</span>
              </Fragment>
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

interface NotFoundTimetableProps {
  id: string;
}

const NotFoundTimetable: FC<NotFoundTimetableProps> = ({ id }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src={school_logo_high}
        alt={`Logo szkoły ${SCHOOL_SHORT}`}
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
