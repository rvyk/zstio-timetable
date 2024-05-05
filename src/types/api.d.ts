import { TableLesson } from "@wulkanowy/timetable-parser";

interface Room {
  title: string;
  id: string;
  lessons: TableLesson[][][];
};
