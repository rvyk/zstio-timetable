import { List, TableHour } from "@majusss/timetable-parser";

interface OptivumTimetable {
  id: string;
  hours: Record<number, TableHour>;
  lessons: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  type: "class" | "teacher" | "room";
  validDate: string;
  dayNames: string[];
  list: List;
}
