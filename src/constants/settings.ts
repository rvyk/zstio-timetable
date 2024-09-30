import { TableHour } from "@majusss/timetable-parser";

/** Time after Next.js will invalidate the cache */
export const REVALIDATE_TIME = 900;

/** Break time between lessons in minutes */
export const BREAK_LENGTH = 5;

/** Shortened lesson length in minutes */
export const SHORT_LESSON_LENGTH = 30;

/** Time format used to recognize and display time */
export const CALCULATED_TIME_FORMAT = "HH:mm";

/** Maximum number of lessons in a timetable */
export const MAX_LESSONS = 14;

/** Maximum number of search results displayed */
export const MAX_RESULTS = 5;

/**
    ZSTiO offers a maximum of 14 shortened lessons (30 minutes) in its timetable. If your school requires more, you can customize this feature to better suit your needs.
*/
export const SHORT_HOURS: TableHour[] = [
  { number: 1, timeFrom: "8:00", timeTo: "8:30" },
  { number: 2, timeFrom: "8:35", timeTo: "9:05" },
  { number: 3, timeFrom: "9:10", timeTo: "9:40" },
  { number: 4, timeFrom: "9:45", timeTo: "10:15" },
  { number: 5, timeFrom: "10:30", timeTo: "11:00" },
  { number: 6, timeFrom: "11:05", timeTo: "11:35" },
  { number: 7, timeFrom: "11:40", timeTo: "12:10" },
  { number: 8, timeFrom: "12:15", timeTo: "12:45" },
  { number: 9, timeFrom: "12:50", timeTo: "13:20" },
  { number: 10, timeFrom: "13:25", timeTo: "13:55" },
  { number: 11, timeFrom: "14:00", timeTo: "14:30" },
  { number: 12, timeFrom: "14:35", timeTo: "15:05" },
  { number: 13, timeFrom: "15:10", timeTo: "15:40" },
  { number: 14, timeFrom: "15:45", timeTo: "16:15" },
];

export const NORMAL_HOURS: TableHour[] = [
  { number: 1, timeFrom: "08:00", timeTo: "08:45" },
  { number: 2, timeFrom: "08:50", timeTo: "09:35" },
  { number: 3, timeFrom: "09:40", timeTo: "10:25" },
  { number: 4, timeFrom: "10:40", timeTo: "11:25" },
  { number: 5, timeFrom: "11:30", timeTo: "12:15" },
  { number: 6, timeFrom: "12:20", timeTo: "13:05" },
  { number: 7, timeFrom: "13:10", timeTo: "13:55" },
  { number: 8, timeFrom: "14:00", timeTo: "14:45" },
  { number: 9, timeFrom: "14:50", timeTo: "15:35" },
  { number: 10, timeFrom: "15:40", timeTo: "16:25" },
  { number: 11, timeFrom: "16:35", timeTo: "17:20" },
  { number: 12, timeFrom: "17:25", timeTo: "18:10" },
  { number: 13, timeFrom: "18:15", timeTo: "19:00" },
  { number: 14, timeFrom: "19:05", timeTo: "19:50" },
];
