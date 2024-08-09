import { List, TableHour, TableLesson } from "@wulkanowy/timetable-parser";

interface OptivumTimetable {
  id: string;
  hours: Record<number, TableHour>;
  lessons: TableLesson[][][];
  generatedDate: string | null;
  title: string;
  type: string;
  validDate: string;
  dayNames: string[];
  list: List;
  substitutions: SubstitutionsPage;
}
