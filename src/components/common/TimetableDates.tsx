import { useT } from "@/components/common/LocaleProvider";
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
  const translate = useT();
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
          <span>{translate("dates.generated")}</span>
          <span className="text-primary/70 font-medium">
            {timetable.generatedDate}
          </span>
        </Fragment>,
      );
    }

    if (timetable.validDate) {
      arr.push(
        <Fragment key="validDate">
          <span>{translate("dates.validFrom")}</span>
          <span className="text-primary/70 font-medium">
            {timetable.validDate}
          </span>
        </Fragment>,
      );
    }

    return arr;
  }, [hasNoLessons, timetable, translate]);

  if (hasNoLessons) {
    return (
      <p className={cn("text-primary/50 text-base", className)}>
        {translate("dates.notFoundStart")}
        {timetable?.id && (
          <span className="text-primary/80 font-mono"> {timetable.id}</span>
        )}{" "}
        {translate("dates.notFoundEnd")}
      </p>
    );
  }

  return (
    <p className={cn("text-primary/45 text-sm", className)}>
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
