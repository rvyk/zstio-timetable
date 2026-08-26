import type { TableLesson } from "@majusss/timetable-parser";

export type PlanGrid = string[][];

const serializeCell = (entries: TableLesson[] = []) =>
  entries
    .map((entry) =>
      [
        entry.subject,
        entry.groupName ?? "",
        entry.teacher ?? "",
        entry.room ?? "",
      ].join("|"),
    )
    .sort()
    .join(";");

export const planGrid = (lessons: TableLesson[][][] = []): PlanGrid =>
  lessons.map((day) => day.map((entries) => serializeCell(entries)));

export interface PlanChange {
  dayIndex: number;
  hourIndex: number;
  before: string;
  after: string;
}

export const planChanges = (
  before: PlanGrid,
  after: PlanGrid,
): PlanChange[] => {
  const changes: PlanChange[] = [];
  const days = Math.max(before.length, after.length);

  for (let dayIndex = 0; dayIndex < days; dayIndex++) {
    const hours = Math.max(
      before[dayIndex]?.length ?? 0,
      after[dayIndex]?.length ?? 0,
    );

    for (let hourIndex = 0; hourIndex < hours; hourIndex++) {
      const previous = before[dayIndex]?.[hourIndex] ?? "";
      const current = after[dayIndex]?.[hourIndex] ?? "";

      if (previous !== current) {
        changes.push({ dayIndex, hourIndex, before: previous, after: current });
      }
    }
  }

  return changes;
};

export const describeCell = (cell: string): string =>
  cell
    .split(";")
    .filter(Boolean)
    .map((entry) => {
      const [subject = "", group = "", teacher = "", room = ""] =
        entry.split("|");
      const meta = [group, teacher, room].filter(Boolean).join(", ");

      return meta ? `${subject} (${meta})` : subject;
    })
    .join(", ");
