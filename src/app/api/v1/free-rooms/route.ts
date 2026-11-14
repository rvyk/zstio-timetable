import { getFreeRoomsWeek } from "@/actions/getFreeRooms";
import {
  CACHE_SHORT,
  fail,
  loadList,
  ok,
  schoolGrid,
  sourceUnavailable,
} from "@/lib/api";
import { isRelativeDay, padHours, parseDay } from "@/lib/apiShape";
import { warsawDayIndex } from "@/lib/dates";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const rawDay = searchParams.get("day");
  const rawLesson = searchParams.get("lesson");

  const dayFilter = rawDay === null ? null : parseDay(rawDay, warsawDayIndex());
  if (rawDay !== null && dayFilter === null) {
    return fail(
      400,
      "invalid_day",
      "day must be 0-6, a weekday name, today or tomorrow",
    );
  }
  if (rawLesson !== null && !/^[1-9]\d*$/.test(rawLesson)) {
    return fail(400, "invalid_lesson", "lesson must be a lesson number (1+)");
  }
  const lessonFilter = rawLesson === null ? null : Number(rawLesson);

  const { list, error } = await loadList();
  if (error) return error;

  const grid = await schoolGrid("room");
  if (!grid) return sourceUnavailable();

  const rooms = list.rooms ?? [];
  const hours = padHours(grid.hours);
  const free = await getFreeRoomsWeek(grid.dayNames.length, hours.length);
  const names = new Map(rooms.map((room) => [room.value, room.name]));

  const days = grid.dayNames
    .map((name, index) => ({
      index,
      name,
      slots: hours
        .map((hour, hourIndex) => ({
          ...hour,
          rooms: (free[index]?.[hourIndex] ?? []).map((id) => ({
            id,
            name: names.get(id) ?? id,
          })),
        }))
        .filter(
          (slot) => lessonFilter === null || slot.number === lessonFilter,
        ),
    }))
    .filter((day) => dayFilter === null || day.index === dayFilter);

  return ok(
    request,
    { totalRooms: rooms.length, days },
    rawDay !== null && isRelativeDay(rawDay) ? CACHE_SHORT : undefined,
  );
};
