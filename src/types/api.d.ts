import { TableLesson } from "@wulkanowy/timetable-parser";

export type Room = {
  title: string;
  id: string;
  lessons: TableLesson[][][];
};
