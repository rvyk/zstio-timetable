import {
  hoursFor,
  invalidAt,
  loadTimetable,
  NO_STORE,
  ok,
  timetableMeta,
  type TimetableParams,
} from "@/lib/api";
import { findNextLesson, isoDay, parseAt } from "@/lib/apiShape";

export const dynamic = "force-dynamic";

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  const searchParams = new URL(request.url).searchParams;
  const at = parseAt(searchParams.get("at"));
  if (!at) return invalidAt();

  const { hours, error: hoursError } = hoursFor(timetable.hours, searchParams);
  if (hoursError) return hoursError;

  const found = findNextLesson(timetable.lessons ?? [], hours, at);

  return ok(
    request,
    {
      ...timetableMeta(timetable),
      at: at.toISOString(),
      next: found && {
        date: isoDay(found.date),
        dayIndex: found.dayIndex,
        dayName: timetable.dayNames[found.dayIndex] ?? null,
        ...found.slot,
        startsAt: found.startsAt.toISOString(),
        startsInMinutes: found.startsInMinutes,
      },
    },
    NO_STORE,
  );
};
