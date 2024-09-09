import { List, TableHour } from "@majusss/timetable-parser";

declare module "@majusss/timetable-parser" {
  export interface ListItem {
    type?: string;
  }
}

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
