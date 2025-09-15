import { cn } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { FC, Fragment, useMemo } from "react";

interface TimetableDatesProps {
  timetable?: OptivumTimetable;
  className?: string;
  stackOnMobile?: boolean;
}

export const TimetableDates: FC<TimetableDatesProps> = ({
  timetable,
  className,
  stackOnMobile,
}) => {
  const hasNoLessons = useMemo(
    () => timetable?.lessons?.some((innerArray) => innerArray.length === 0) ?? true,
    [timetable?.lessons],
  );

  const elements = useMemo(() => {
    if (hasNoLessons || !timetable) return [] as JSX.Element[];

    const arr: JSX.Element[] = [];

    if (timetable.generatedDate && timetable.generatedDate !== "Invalid date") {
      arr.push(
        <Fragment key="generatedDate">
          Wygenerowano:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.generatedDate}
          </span>
        </Fragment>,
      );
    }

    if (timetable.validDate) {
      arr.push(
        <Fragment key="validDate">
          Obowiązuje od:{" "}
          <span className="font-semibold text-primary/90">
            {timetable.validDate}
          </span>
        </Fragment>,
      );
    }

    return arr;
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
      {elements.map((el, idx) =>
        stackOnMobile ? (
          <span key={idx} className="block sm:inline">
            {el}
            {idx < elements.length - 1 && (
              <span className="hidden sm:inline">, </span>
            )}
          </span>
        ) : (
          <Fragment key={idx}>
            {el}
            {idx < elements.length - 1 && ", "}
          </Fragment>
        ),
      )}
    </p>
  );
};

