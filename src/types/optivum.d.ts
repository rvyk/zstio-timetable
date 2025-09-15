import { List, TableHour, TableLesson } from "@majusss/timetable-parser";

declare module "@majusss/timetable-parser" {
  export interface ListItem {
    type?: string;
  }
}

interface Room {
  id: string;
  title: string;
  lessons?: TableLesson[][][];
}

interface OptivumTimetable {
  id: string;
  hours: Record<number, TableHour>;
  lessons?: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  type: "class" | "teacher" | "room";
  validDate: string | null;
  dayNames: string[];
  list: List;
  lastUpdated: string;
}

