import { BREAK_LENGTH, SHORT_LESSON_LENGTH } from "@/constants/settings";
import { shiftTime } from "@/lib/dates";
import { TableHour } from "@majusss/timetable-parser";

export const adjustShortenedLessons = (
  startIndex: number,
  defaultHours: TableHour[],
): TableHour[] => {
  return defaultHours.reduce((adjustedHours: TableHour[], hour) => {
    const hourNumber = Number(hour.number);

    const previousHour = adjustedHours[adjustedHours.length - 1];

    if (hourNumber >= startIndex && previousHour) {
      const timeFrom = shiftTime(previousHour.timeTo, BREAK_LENGTH);

      adjustedHours.push({
        ...hour,
        timeFrom,
        timeTo: shiftTime(timeFrom, SHORT_LESSON_LENGTH),
      });
    } else {
      adjustedHours.push(hour);
    }

    return adjustedHours;
  }, []);
};
