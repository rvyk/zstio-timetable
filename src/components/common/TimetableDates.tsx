import { cn } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { FC, Fragment, JSX, useMemo } from "react";

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
    () =>
      timetable?.lessons?.some((innerArray) => innerArray.length === 0) ?? true,
    [timetable?.lessons],
  );

  const elements = useMemo(() => {
    if (hasNoLessons || !timetable) return [] as JSX.Element[];

    const arr: JSX.Element[] = [];

    if (timetable.generatedDate && timetable.generatedDate !== "Invalid date") {
      arr.push(
        <Fragment key="generatedDate">
          <span className="max-md:text-primary/90 max-md:font-semibold">
            Wygenerowano:{" "}
          </span>
          <span className="text-primary/70 font-medium">
            {timetable.generatedDate}
          </span>
        </Fragment>,
      );
    }

    if (timetable.validDate) {
      arr.push(
        <Fragment key="validDate">
          <span className="max-md:text-primary/90 max-md:font-semibold">
            Obowiązuje od:{" "}
          </span>
          <span className="text-primary/70 font-medium">
            {timetable.validDate}
          </span>
        </Fragment>,
      );
    }

    return arr;
  }, [hasNoLessons, timetable]);

  if (hasNoLessons) {
    return (
      <p className={cn("text-primary/50 text-base", className)}>
        Szukany plan zajęć
        {timetable?.id && (
          <span className="text-primary/80 font-mono"> {timetable.id}</span>
        )}{" "}
        nie mógł zostać znaleziony.
      </p>
    );
  }

  return (
    <p
      className={cn(
        "text-primary/45 text-sm",
        className,
      )}
    >
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
