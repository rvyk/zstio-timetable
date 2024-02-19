import { TableHour, TableLesson } from "@wulkanowy/timetable-parser";

type Classes = {
  title: string;
  id: string;
  lessons: TableLesson[][][];
};

type AllClasses = {
  success: boolean;
  classes: Classes[];
  msg?: string;
};

type EmptyClasses = {
  name: string;
  value?: string;
  url?: string;
};

type Empty = {
  classes: EmptyClasses[];
};

type TimetableAPI = {
  success: boolean;
  title: string;
  days: string[];
  generatedDate: string;
  validDate: string;
  lessons: TableLesson[][][];
  hours: Record<number, TableHour>;
};

export type { AllClasses, Classes, Empty, EmptyClasses, TimetableAPI };
