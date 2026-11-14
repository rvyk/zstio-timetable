import {
  hoursFor,
  invalidAt,
  loadTimetable,
  NO_STORE,
  ok,
  timetableMeta,
  type TimetableParams,
} from "@/lib/api";
import { daySlots, isoDay, nowState, parseAt, warsawAt } from "@/lib/apiShape";
import { isSchoolDayOff } from "@/lib/schoolYear";

export const dynamic = "force-dynamic";

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  const searchParams = new URL(request.url).searchParams;
  const at = parseAt(searchParams.get("at"));
  if (!at) return invalidAt();

  const { hours, error: hoursError } = hoursFor(timetable.hours, searchParams);
  if (hoursError) return hoursError;

  const { date, dayIndex, minutes } = warsawAt(at);
  const dayOff = isSchoolDayOff(date);
  const slots = dayOff ? [] : daySlots(hours, timetable.lessons?.[dayIndex]);

  return ok(
    request,
    {
      ...timetableMeta(timetable),
      at: at.toISOString(),
      date: isoDay(date),
      dayIndex,
      dayName: timetable.dayNames[dayIndex] ?? null,
      dayOff,
      ...nowState(slots, minutes),
    },
    NO_STORE,
  );
};
