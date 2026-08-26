import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { getCalendar } from "@/lib/calendar";
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

  const timetable = await getOptivumTimetable(type, match[2]!);
  if (!timetable.lessons?.length) {
    return new Response("Not found", { status: 404 });
  }

  const { error, value } = await getCalendar(
    timetable.lessons,
    Object.values(timetable.hours),
  );

  if (error ?? !value) {
    console.error("Failed to build calendar:", error);
    return new Response("Calendar error", { status: 500 });
  }

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${timetable.id}.ics"`,
      "Cache-Control": "public, max-age=0, s-maxage=900",
    },
  });
};
