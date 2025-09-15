import { cn } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { FC, Fragment, useMemo } from "react";

interface TimetableDatesProps {
  timetable?: OptivumTimetable;
  className?: string;
}

export const TimetableDates: FC<TimetableDatesProps> = ({ timetable, className }) => {
  const hasNoLessons = useMemo(
    () => timetable?.lessons?.some((innerArray) => innerArray.length === 0) ?? true,
    [timetable?.lessons],
  );

  const dateElements = useMemo(() => {
    if (hasNoLessons || !timetable) return null;

    const elements = [] as (string | JSX.Element)[];

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

    return elements.reduce<(string | JSX.Element)[]>((acc, curr, index, array) => {
      if (index < array.length - 1) {
        return [...acc, curr, ", "];
      }
      return [...acc, curr];
    }, []);
  }, [hasNoLessons, timetable]);

  if (hasNoLessons) {
    return (
      <p className={cn("text-base font-medium text-primary/50", className)}>
        Szukany plan zajęć{" "}
        <span className="font-semibold text-primary/90">({timetable?.id})</span>{" "}
        nie mógł zostać znaleziony.
      </p>
    );
  }

  return (
    <p className={cn("text-sm font-medium text-primary/70 xl:text-base", className)}>
      {dateElements}
    </p>
  );
};

