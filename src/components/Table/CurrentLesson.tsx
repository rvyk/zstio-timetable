import { getCurrentLesson } from "@/utils/currentLesson";
import { useEffect, useState } from "react";

function CurrentLesson({ timeFrom, timeTo }) {
  const [minutesRemaining, setMinutesRemaining] = useState(
    getCurrentLesson(timeFrom, timeTo).minutesRemaining,
  );
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(
    getCurrentLesson(timeFrom, timeTo).isWithinTimeRange,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      let { isWithinTimeRange, minutesRemaining } = getCurrentLesson(
        timeFrom,
        timeTo,
      );
      setMinutesRemaining(minutesRemaining);
      setIsWithinTimeRange(isWithinTimeRange);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeFrom, timeTo]);

  return (
    <>
      {isWithinTimeRange && minutesRemaining > 0 && (
        <div className="bg-blue-100 mt-1 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-100 dark:text-red-800 border border-blue-400 dark:border-red-400">
          <p>{minutesRemaining == 1 ? "ZOSTAŁA" : "ZOSTAŁO"}</p>
          <p>{`${minutesRemaining} MIN`}</p>
        </div>
      )}
    </>
  );
}

export default CurrentLesson;
