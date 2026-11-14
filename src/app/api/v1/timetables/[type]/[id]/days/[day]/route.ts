import {
  CACHE_SHORT,
  fail,
  hoursFor,
  loadTimetable,
  ok,
  shapeDay,
  timetableMeta,
} from "@/lib/api";
import { isRelativeDay, parseDay } from "@/lib/apiShape";
import { warsawDayIndex } from "@/lib/dates";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ type: string; id: string; day: string }> },
) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  const { day } = await params;
  const index = parseDay(day, warsawDayIndex());
  if (index === null) {
    return fail(
      400,
      "invalid_day",
      "day must be 0-6, a weekday name, today or tomorrow",
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const { hours, error: hoursError } = hoursFor(timetable.hours, searchParams);
  if (hoursError) return hoursError;

  return ok(
    request,
    { ...timetableMeta(timetable), day: shapeDay(timetable, hours, index) },
    isRelativeDay(day) ? CACHE_SHORT : undefined,
  );
};
