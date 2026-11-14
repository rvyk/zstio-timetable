import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { calendarResponse } from "@/lib/calendar";
import type { OptivumTimetable } from "@/types/optivum";

const PREFIX_TO_TYPE: Record<string, OptivumTimetable["type"]> = {
  o: "class",
  n: "teacher",
  s: "room",
};

export const dynamic = "force-dynamic";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const match = /^([nos])(\d+)(?:\.ics)?$/.exec(id);
  const type = match && PREFIX_TO_TYPE[match[1]!];

  if (!type) return new Response("Not found", { status: 404 });

  const list = await getOptivumList();
  const listed = {
    class: list.classes,
    teacher: list.teachers,
    room: list.rooms,
  }[type];
  if (!listed?.some((item) => item.value === match[2])) {
    return new Response("Not found", { status: 404 });
  }

  const timetable = await getOptivumTimetable(type, match[2]!);
  if (!timetable.lessons?.length) {
    return new Response("Not found", { status: 404 });
  }

  return calendarResponse(timetable);
};
