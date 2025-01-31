import { List, TableHour, TableLesson } from "@majusss/timetable-parser";

declare module "@majusss/timetable-parser" {
  export interface ListItem {
    type?: string;
  }
}

declare module "@majusss/substitutions-parser/dist/types" {
  export interface LessonSubstitute {
    teacherId?: string;
    roomId?: string;
  }
  export interface SubstitutionsPage {
    lastUpdated: string;
  }
}

interface Room {
  id: string;
  title: string;
  lessons?: TableLesson[][][];
}

interface TimetableDiff {
  kind: "N" | "D" | "E" | "A";
  newValue?: string;
  oldValue?: string;
}

type LessonChange = {
  [K in keyof TableLesson]?: TimetableDiff;
};

type TimetableDiffsProp = {
  isNewReliable: boolean;
  validDate?: TimetableDiff;
  generatedDate?: TimetableDiff;
  lessons: Array<Array<Array<Partial<LessonChange>>>>;
};

interface OptivumTimetable {
  id: string;
  hours: Record<number, TableHour>;
  lessons?: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  type: "class" | "teacher" | "room";
  validDate: string;
  dayNames: string[];
  list: List;
  lastUpdated: string;
  diffs?: TimetableDiffsProp;
  lastModified: number;
}

interface SubstitutionListItem {
  name: string;
  type: string;
}
