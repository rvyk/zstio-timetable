import { TableHour, TableLesson } from "@wulkanowy/timetable-parser";

type classesApiType = {
  title: string;
  id: string;
  lessons: [lessonType, lessonType, lessonType, lessonType, lessonType];
};

type allApiType = {
  success: boolean;
  classes: classesApiType[];
};

type emptyClassesType = {
  name: string;
  value?: string;
  url?: string;
};

type emptyApiType = {
  success: boolean;
  classes: emptyClassesType[];
};

type timetableApiType = {
  title: string;
  days: string[];
  generatedDate: string;
  validDate: string;
  lessons: TableLesson[][][];
  hours: Record<number, TableHour>;
};

export type { allApiType, emptyApiType, timetableApiType };
