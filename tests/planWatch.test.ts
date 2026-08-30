import assert from "node:assert/strict";
import test from "node:test";
import { planGrid } from "../src/lib/planDiff.ts";
import { changesEmbed, summarizeChanges } from "../src/lib/planWatch.ts";

const timetable = { id: "o12", title: "1A", type: "class" as const };

const plan = (
  title: string,
  type: "class" | "teacher" | "room",
  count = 1,
) => ({ id: type[0] + title, value: "1", title, type, count });

test("summarizeChanges zgłasza plan tylko gdy coś się zmieniło", () => {
  const before = planGrid([[[{ subject: "matma", teacher: "WJ" }]]]);
  const after = planGrid([[[{ subject: "wf", teacher: "Ró" }]]]);

  assert.equal(summarizeChanges("12", timetable, before, before), null);
  assert.deepEqual(summarizeChanges("12", timetable, before, after), {
    id: "o12",
    value: "12",
    title: "1A",
    type: "class",
    count: 1,
  });
});

test("changesEmbed grupuje plany po typie i podaje czas wykrycia", () => {
  const embed = changesEmbed(
    [plan("1A", "class"), plan("2B", "class"), plan("Kowalski", "teacher")],
    "1 września 2026r.",
    new Date("2026-08-30T12:34:00Z"),
  );

  assert.equal(embed.description, "Zmiany w 3 planach.");
  assert.deepEqual(
    embed.fields.map((f) => f.name),
    ["Oddziały (2)", "Nauczyciele (1)", "Wykryto", "Obowiązuje od"],
  );
  assert.equal(embed.fields[0]!.value, "1A, 2B");
  assert.match(embed.fields[2]!.value, /14:34/);
});

test("changesEmbed nie przekracza limitu 1024 znaków na pole", () => {
  const many = Array.from({ length: 300 }, (_, i) =>
    plan(`Oddzial-numer-${i}`, "class"),
  );
  const embed = changesEmbed(many, null);

  assert.ok(embed.fields[0]!.value.length <= 1024);
  assert.match(embed.fields[0]!.value, /i \d+ więcej$/);
});
