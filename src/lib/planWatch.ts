import type { OptivumTimetable } from "@/types/optivum";
import { describeCell, planChanges, type PlanGrid } from "./planDiff.ts";

const MAX_LINES = 15;

const TYPE_LABEL: Record<OptivumTimetable["type"], string> = {
  class: "Oddział",
  teacher: "Nauczyciel",
  room: "Sala",
};

export interface ChangedPlan {
  id: string;
  value: string;
  title: string;
  type: OptivumTimetable["type"];
  generatedDate: string | null;
  validDate: string | null;
  lines: string[];
  count: number;
}

export const summarizeChanges = (
  value: string,
  timetable: Pick<
    OptivumTimetable,
    "id" | "title" | "type" | "dayNames" | "generatedDate" | "validDate"
  >,
  before: PlanGrid,
  after: PlanGrid,
): ChangedPlan | null => {
  const changes = planChanges(before, after);
  if (changes.length === 0) return null;

  const lines = changes.slice(0, MAX_LINES).map((change) => {
    const day =
      timetable.dayNames[change.dayIndex] ?? `Dzień ${change.dayIndex + 1}`;
    const where = `**${day}, lekcja ${change.hourIndex + 1}**`;

    if (!change.before)
      return `${where} — dodano: ${describeCell(change.after)}`;
    if (!change.after)
      return `${where} — usunięto: ${describeCell(change.before)}`;

    return `${where} — ${describeCell(change.before)} → ${describeCell(change.after)}`;
  });

  if (changes.length > lines.length) {
    lines.push(`…i ${changes.length - lines.length} więcej zmian`);
  }

  return {
    id: timetable.id,
    value,
    title: timetable.title,
    type: timetable.type,
    generatedDate: timetable.generatedDate,
    validDate: timetable.validDate,
    lines,
    count: changes.length,
  };
};

export const planEmbed = (plan: ChangedPlan, appUrl: string) => ({
  title: `${TYPE_LABEL[plan.type]} ${plan.title || plan.id}`,
  url: `${appUrl.replace(/\/+$/, "")}/${plan.type}/${plan.value}`,
  description: plan.lines.join("\n").slice(0, 4096),
  color: 0x5865f2,
  fields: [
    { name: "Zmian", value: String(plan.count), inline: true },
    { name: "Obowiązuje od", value: plan.validDate ?? "—", inline: true },
    { name: "Wygenerowano", value: plan.generatedDate ?? "—", inline: true },
  ],
  footer: { text: `ID planu: ${plan.id}` },
  timestamp: new Date().toISOString(),
});
