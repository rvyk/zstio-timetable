import {
  loadTimetable,
  ok,
  timetableMeta,
  type TimetableParams,
} from "@/lib/api";
import { busyPeriods, subjectSummary } from "@/lib/apiShape";

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  return ok(request, {
    ...timetableMeta(timetable),
    periodsPerWeek: busyPeriods(timetable.lessons),
    subjects: subjectSummary(timetable.lessons),
  });
};
