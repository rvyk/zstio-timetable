import {
  BREAK_LENGTH,
  CALCULATED_TIME_FORMAT,
  SHORT_LESSON_LENGTH,
} from "@/constants/hours";
import { TableHour } from "@majusss/timetable-parser";
import moment from "moment";

export const adjustShortenedLessons = (
  startIndex: number,
  defaultHours: TableHour[],
): TableHour[] => {
  return defaultHours.reduce((adjustedHours: TableHour[], hour) => {
    const hourNumber = Number(hour.number);

    if (hourNumber >= startIndex ) {
      const previousHour = adjustedHours[adjustedHours.length - 1];
      const { timeFrom, timeTo } = calculateNewTimes(
        previousHour.timeTo,
        BREAK_LENGTH,
        SHORT_LESSON_LENGTH,
      );

      adjustedHours.push({
        ...hour,
        timeFrom,
        timeTo,
      });
    } else {
      adjustedHours.push(hour);
    }

    return adjustedHours;
  }, []);
};

const calculateNewTimes = (
  previousTimeTo: string,
  breakLength: number,
  lessonLength: number,
): { timeFrom: string; timeTo: string } => {
  const newTimeFrom = moment(previousTimeTo, CALCULATED_TIME_FORMAT)
    .add(breakLength, "minutes")
    .format(CALCULATED_TIME_FORMAT);

  const newTimeTo = moment(newTimeFrom, CALCULATED_TIME_FORMAT)
    .add(lessonLength, "minutes")
    .format(CALCULATED_TIME_FORMAT);

  return { timeFrom: newTimeFrom, timeTo: newTimeTo };
};
