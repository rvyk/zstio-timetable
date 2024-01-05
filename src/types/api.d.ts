import { TableHour, TableLesson } from "@wulkanowy/timetable-parser";

type Classes = {
  title: string;
  id: string;
  lessons: TableLesson[][][];
};

type AllClasses = {
  success: boolean;
  classes: Classes[];
};

type EmptyClasses = {
  name: string;
  value?: string;
  url?: string;
};

type EmptyAPI = {
  success: boolean;
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

export type { AllClasses, Classes, EmptyAPI, EmptyClasses, TimetableAPI };
