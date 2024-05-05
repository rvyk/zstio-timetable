"use client";

import { cn, getCurrentLesson } from "@/lib/utils";
import { useEffect, useState } from "react";

function CurrentLesson({
  timeFrom,
  timeTo,
  className,
}: {
  timeFrom: string;
  timeTo: string;
  className?: string;
}) {
  const [minutesRemaining, setMinutesRemaining] = useState(
    getCurrentLesson(timeFrom, timeTo).minutesRemaining,
  );
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(
    getCurrentLesson(timeFrom, timeTo).isWithinTimeRange,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const { isWithinTimeRange, minutesRemaining } = getCurrentLesson(
        timeFrom,
        timeTo,
      );
      setMinutesRemaining(minutesRemaining);
      setIsWithinTimeRange(isWithinTimeRange);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeFrom, timeTo]);

  if (!isWithinTimeRange || minutesRemaining <= 0) return null;
  return (
    <>
      <div
        className={cn(
          "flex h-fit w-fit flex-col items-center justify-center rounded border border-blue-400 bg-blue-100 px-2.5 py-0.5  text-xs font-medium text-blue-800 dark:border-red-400 dark:bg-red-100 dark:text-red-800",
          className,
        )}
      >
        <p>{minutesRemaining == 1 ? "ZOSTAŁA" : "ZOSTAŁO"}</p>
        <p>{`${minutesRemaining} MIN`}</p>
      </div>
    </>
  );
}

export default CurrentLesson;
