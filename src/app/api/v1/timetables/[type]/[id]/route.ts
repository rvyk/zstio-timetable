import {
  hoursFor,
  loadTimetable,
  ok,
  shapeDay,
  timetableMeta,
  type TimetableParams,
} from "@/lib/api";

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  const searchParams = new URL(request.url).searchParams;
  const { hours, error: hoursError } = hoursFor(timetable.hours, searchParams);
  if (hoursError) return hoursError;

  return ok(request, {
    ...timetableMeta(timetable),
    hours,
    days: timetable.dayNames.map((_, index) =>
      shapeDay(timetable, hours, index),
    ),
  });
};
