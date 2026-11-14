import { loadTimetable, type TimetableParams } from "@/lib/api";
import { calendarResponse } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export const GET = async (request: Request, { params }: TimetableParams) => {
  const { timetable, error } = await loadTimetable(params, request);
  if (error) return error;

  return calendarResponse(timetable);
};
