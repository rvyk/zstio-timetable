import { List, TableHour, TableLesson } from "@wulkanowy/timetable-parser";

export type OptivumTimetable = {
  id: string;
  hours: Record<number, TableHour>;
  lessons: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  validDate: string;
  days: TableLesson[][][];
  dayNames: string[];
  list: List;
};
