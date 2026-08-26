import assert from "node:assert/strict";
import test from "node:test";
import { describeCell, planChanges, planGrid } from "../src/lib/planDiff.ts";

const lesson = (subject: string, teacher?: string, room?: string) => ({
  subject,
  teacher,
  room,
});

test("planGrid serializuje wpisy niezależnie od kolejności", () => {
  const a = planGrid([[[lesson("matma", "WJ", "17"), lesson("wf", "Ró")]]]);
  const b = planGrid([[[lesson("wf", "Ró"), lesson("matma", "WJ", "17")]]]);

  assert.deepEqual(a, b);
});

test("planChanges wykrywa podmianę, dodanie i usunięcie lekcji", () => {
  const before = planGrid([
    [[lesson("matma", "WJ", "17")], [], [lesson("wf")]],
  ]);
  const after = planGrid([
    [[lesson("informatyka", "Ko", "33")], [lesson("religia")], []],
  ]);

  assert.deepEqual(planChanges(before, after), [
    {
      dayIndex: 0,
      hourIndex: 0,
      before: "matma||WJ|17",
      after: "informatyka||Ko|33",
    },
    { dayIndex: 0, hourIndex: 1, before: "", after: "religia|||" },
    { dayIndex: 0, hourIndex: 2, before: "wf|||", after: "" },
  ]);
});

test("planChanges milczy, gdy plan się nie zmienił", () => {
  const grid = planGrid([[[lesson("matma", "WJ", "17")]]]);

  assert.deepEqual(planChanges(grid, grid), []);
});

test("planChanges radzi sobie z nowym dniem w planie", () => {
  const before = planGrid([[[lesson("matma")]]]);
  const after = planGrid([[[lesson("matma")]], [[lesson("wf")]]]);

  assert.deepEqual(planChanges(before, after), [
    { dayIndex: 1, hourIndex: 0, before: "", after: "wf|||" },
  ]);
});

test("describeCell składa czytelny opis", () => {
  assert.equal(describeCell("matma|1/2|WJ|B17"), "matma (1/2, WJ, B17)");
  assert.equal(describeCell("wf|||"), "wf");
  assert.equal(
    describeCell("matma||WJ|17;wf||Ró|G1"),
    "matma (WJ, 17), wf (Ró, G1)",
  );
  assert.equal(describeCell(""), "");
});
