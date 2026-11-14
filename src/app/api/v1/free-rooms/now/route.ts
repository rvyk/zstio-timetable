import { getFreeRoomsWeek } from "@/actions/getFreeRooms";
import {
  hoursFor,
  invalidAt,
  loadList,
  NO_STORE,
  ok,
  schoolGrid,
  sourceUnavailable,
} from "@/lib/api";
import { currentPeriod, isoDay, parseAt, warsawAt } from "@/lib/apiShape";
import { isSchoolDayOff } from "@/lib/schoolYear";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const at = parseAt(searchParams.get("at"));
  if (!at) return invalidAt();

  const { list, error } = await loadList();
  if (error) return error;

  const grid = await schoolGrid("room");
  if (!grid) return sourceUnavailable();

  const { hours, error: hoursError } = hoursFor(grid.hours, searchParams);
  if (hoursError) return hoursError;

  const { date, dayIndex, minutes } = warsawAt(at);
  const dayOff = isSchoolDayOff(date) || dayIndex >= grid.dayNames.length;
  const period = dayOff ? null : currentPeriod(hours, minutes);

  const free = period
    ? await getFreeRoomsWeek(grid.dayNames.length, grid.hours.length)
    : [];
  const names = new Map(
    (list.rooms ?? []).map((room) => [room.value, room.name]),
  );
  const ids = period
    ? (free[dayIndex]?.[hours.indexOf(period.hour)] ?? [])
    : [];

  return ok(
    request,
    {
      at: at.toISOString(),
      date: isoDay(date),
      dayIndex,
      dayOff,
      lesson: period && { ...period.hour, upcoming: period.upcoming },
      rooms: ids.map((id) => ({ id, name: names.get(id) ?? id })),
    },
    NO_STORE,
  );
};
