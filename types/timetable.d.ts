import { TableHour, TableLesson } from "@wulkanowy/timetable-parser";

export type OptivumTimetable = {
  hours: Record<number, TableHour>;
  lessons: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  validDate: string;
  days: TableLesson[][][];
  dayNames: string[];
};
