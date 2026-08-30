import type { OptivumTimetable } from "@/types/optivum";
import { planChanges, type PlanGrid } from "./planDiff.ts";

const TYPE_FIELD: Record<OptivumTimetable["type"], string> = {
  class: "Oddziały",
  teacher: "Nauczyciele",
  room: "Sale",
};

const MAX_FIELD_CHARS = 1024;

export interface ChangedPlan {
  id: string;
  value: string;
  title: string;
  type: OptivumTimetable["type"];
  count: number;
}

export const summarizeChanges = (
  value: string,
  timetable: Pick<OptivumTimetable, "id" | "title" | "type">,
  before: PlanGrid,
  after: PlanGrid,
): ChangedPlan | null => {
  const count = planChanges(before, after).length;

  if (count === 0) return null;

  return {
    id: timetable.id,
    value,
    title: timetable.title,
    type: timetable.type,
    count,
  };
};

const joinNames = (plans: ChangedPlan[]): string => {
  const names = plans.map((plan) => plan.title || plan.id);
  const kept: string[] = [];

  for (const name of names) {
    const candidate = [...kept, name].join(", ");
    if (candidate.length > MAX_FIELD_CHARS - 20) break;
    kept.push(name);
  }

  const rest = names.length - kept.length;

  return rest > 0
    ? `${kept.join(", ")} i ${rest} więcej`
    : kept.join(", ") || "—";
};

export const detectedAt = (now: Date): string =>
  now.toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    dateStyle: "short",
    timeStyle: "short",
  });

export const changesEmbed = (
  plans: ChangedPlan[],
  validDate: string | null,
  now = new Date(),
) => {
  const types: OptivumTimetable["type"][] = ["class", "teacher", "room"];

  const fields = types
    .map((type) => ({ type, list: plans.filter((plan) => plan.type === type) }))
    .filter(({ list }) => list.length > 0)
    .map(({ type, list }) => ({
      name: `${TYPE_FIELD[type]} (${list.length})`,
      value: joinNames(list),
      inline: false,
    }));

  return {
    title: "Zmienił się plan lekcji",
    description: `Zmiany w ${plans.length} ${plans.length === 1 ? "planie" : "planach"}.`,
    color: 0x5865f2,
    fields: [
      ...fields,
      { name: "Wykryto", value: detectedAt(now), inline: true },
      { name: "Obowiązuje od", value: validDate ?? "—", inline: true },
    ],
    timestamp: now.toISOString(),
  };
};
