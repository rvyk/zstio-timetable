import {
  CACHE_SHORT,
  fail,
  hoursFor,
  loadTimetable,
  ok,
  shapeDay,
  timetableMeta,
  type TimetableParams,
} from "@/lib/api";
import { isoDay, mondayOf, parseIsoDay } from "@/lib/apiShape";
import { warsawToday } from "@/lib/dates";
import { isSchoolDayOff } from "@/lib/schoolYear";

const DAY = 86_400_000;

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  const searchParams = new URL(request.url).searchParams;
  const rawFrom = searchParams.get("from");
  const from = rawFrom ? parseIsoDay(rawFrom) : warsawToday();
  if (!from) return fail(400, "invalid_from", "from must be a YYYY-MM-DD date");

  const { hours, error: hoursError } = hoursFor(timetable.hours, searchParams);
  if (hoursError) return hoursError;

  const monday = mondayOf(from);
  const days = timetable.dayNames.map((_, index) => {
    const date = new Date(monday.getTime() + index * DAY);
    const dayOff = isSchoolDayOff(date);
    const day = shapeDay(timetable, hours, index);

    return {
      ...day,
      date: isoDay(date),
      dayOff,
      slots: dayOff ? [] : day.slots,
    };
  });

  return ok(
    request,
    {
      ...timetableMeta(timetable),
      weekStart: isoDay(monday),
      hours,
      days,
    },
    rawFrom ? undefined : CACHE_SHORT,
  );
};
