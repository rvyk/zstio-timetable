import { TableHour, TableLesson } from "@wulkanowy/timetable-parser/lib/types";

type classesApiType = {
  title: string;
  id: string;
  lessons: [lessonType, lessonType, lessonType, lessonType, lessonType];
};

type allApiType = {
  success: boolean;
  classes: classesApiType[];
};

type emptyApiType = {
  success: boolean;
  classes: nameValueType[];
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
