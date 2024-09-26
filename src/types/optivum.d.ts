import { List, TableHour, TableLesson } from "@majusss/timetable-parser";

declare module "@majusss/timetable-parser" {
  export interface ListItem {
    type?: string;
  }
}

declare module "@majusss/substitutions-parser" {
  export interface LessonSubstitute {
    roomId?: string;
    teacherId?: string;
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

interface SubstitutionListItem {
  name: string;
  type: string;
}
