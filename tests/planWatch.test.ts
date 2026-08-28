import assert from "node:assert/strict";
import test from "node:test";
import { planGrid } from "../src/lib/planDiff.ts";
import { planEmbed, summarizeChanges } from "../src/lib/planWatch.ts";

const timetable = {
  id: "o12",
  title: "1A",
  type: "class" as const,
  dayNames: ["Poniedziałek", "Wtorek"],
  generatedDate: "2026-08-28",
  validDate: "2026-09-01",
};

test("summarizeChanges opisuje który plan i co się zmieniło", () => {
  const before = planGrid([
    [[{ subject: "matma", teacher: "WJ", room: "17" }]],
  ]);
  const after = planGrid([[[{ subject: "wf", teacher: "Ró", room: "sala" }]]]);

  const summary = summarizeChanges("12", timetable, before, after);

  assert.ok(summary);
  assert.equal(summary.id, "o12");
  assert.equal(summary.count, 1);
  assert.match(summary.lines[0]!, /Poniedziałek, lekcja 1/);
  assert.match(summary.lines[0]!, /matma \(WJ, 17\) → wf \(Ró, sala\)/);
});

test("summarizeChanges zwraca null bez zmian", () => {
  const grid = planGrid([[[{ subject: "matma" }]]]);
  assert.equal(summarizeChanges("12", timetable, grid, grid), null);
});

test("planEmbed linkuje do konkretnego planu", () => {
  const summary = summarizeChanges(
    "12",
    timetable,
    planGrid([[[]]]),
    planGrid([[[{ subject: "matma" }]]]),
  )!;

  assert.equal(
    planEmbed(summary, "https://plan.zstiojar.edu.pl/").url,
    "https://plan.zstiojar.edu.pl/class/12",
  );
});
