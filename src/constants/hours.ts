import { TableHour } from "@majusss/timetable-parser";

/*
    ZSTiO offers a maximum of 14 shortened lessons (30 minutes) in its timetable. If your school requires more, you can customize this feature to better suit your needs.
*/
export const SHORT_HOURS: TableHour[] = [
  {
    number: 1,
    timeFrom: "8:00",
    timeTo: "8:30",
  },
  {
    number: 2,
    timeFrom: "8:35",
    timeTo: "9:05",
  },
  {
    number: 3,
    timeFrom: "9:10",
    timeTo: "9:40",
  },
  {
    number: 4,
    timeFrom: "9:45",
    timeTo: "10:15",
  },
  {
    number: 5,
    timeFrom: "10:30",
    timeTo: "11:00",
  },
  {
    number: 6,
    timeFrom: "11:05",
    timeTo: "11:35",
  },
  {
    number: 7,
    timeFrom: "11:40",
    timeTo: "12:10",
  },
  {
    number: 8,
    timeFrom: "12:15",
    timeTo: "12:45",
  },
  {
    number: 9,
    timeFrom: "12:50",
    timeTo: "13:20",
  },
  {
    number: 10,
    timeFrom: "13:25",
    timeTo: "13:55",
  },
  {
    number: 11,
    timeFrom: "14:00",
    timeTo: "14:30",
  },
  {
    number: 12,
    timeFrom: "14:35",
    timeTo: "15:05",
  },
  {
    number: 13,
    timeFrom: "15:10",
    timeTo: "15:40",
  },
  {
    number: 14,
    timeFrom: "15:45",
    timeTo: "16:15",
  },
];

// Break time between lessons in minutes
export const BREAK_LENGTH = 5;

// Shortened lesson length in minutes
export const SHORT_LESSON_LENGTH = 30;

// Time format used to recognize and display time
export const CALCULATED_TIME_FORMAT = "HH:mm";
