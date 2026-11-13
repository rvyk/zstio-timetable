import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import type { OptivumTimetable } from "@/types/optivum";
import { cache } from "react";

export interface TimetableRouteParams {
  path?: string[];
}

export const getTimetable = cache(getOptivumTimetable);

const TIMETABLE_TYPES: readonly OptivumTimetable["type"][] = [
  "class",
  "teacher",
  "room",
] as const;

export const isTimetableType = (
  value: string | undefined,
): value is OptivumTimetable["type"] =>
  TIMETABLE_TYPES.includes(value as OptivumTimetable["type"]);

export const timetableStaticParams = async () => {
  const { classes, rooms, teachers } = await getOptivumList();

  const classParams = classes.map((c) => ({ path: ["class", c.value] }));
  const roomParams = rooms?.map((r) => ({ path: ["room", r.value] })) ?? [];
  const teacherParams =
    teachers?.map((t) => ({ path: ["teacher", t.value] })) ?? [];

  return [...classParams, ...roomParams, ...teacherParams];
};
