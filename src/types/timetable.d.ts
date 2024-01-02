import { TableHour, TableLesson } from "@wulkanowy/timetable-parser";

export type TimeTableData = {
  hours: Record<number, TableHour>;
  validDate: string;
  title: string;
  generatedDate: string | null;
  lessons: TableLesson[][][];
  dayNames: string[];
  days: TableLesson[][][];
  text: string;
  id: string;
};
