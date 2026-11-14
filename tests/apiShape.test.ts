import assert from "node:assert/strict";
import test from "node:test";
import {
  busyPeriods,
  currentPeriod,
  daySlots,
  filterGroup,
  findNextLesson,
  groupNames,
  isoFromOptivum,
  isRelativeDay,
  mondayOf,
  normalizeSearch,
  nowState,
  padTime,
  parseAt,
  parseChangeCell,
  parseDay,
  parseIsoDay,
  subjectSummary,
} from "../src/lib/apiShape.ts";
import { warsawLocal } from "../src/lib/dates.ts";

const hours = [
  { number: 1, timeFrom: "8:00", timeTo: "8:45" },
  { number: 2, timeFrom: "8:50", timeTo: "9:35" },
  { number: 3, timeFrom: "9:45", timeTo: "10:30" },
  { number: 4, timeFrom: "10:35", timeTo: "11:20" },
];

const monday = [
  [],
  [{ subject: "matma", teacher: "Ko", teacherId: "7" }],
  [],
  [
    { subject: "wf", groupName: "1/2" },
    { subject: "wf", groupName: "2/2" },
  ],
];

const slots = daySlots(hours, monday);

test("parseDay rozumie liczby, nazwy i dni względne", () => {
  assert.equal(parseDay("0", 3), 0);
  assert.equal(parseDay("Friday", 0), 4);
  assert.equal(parseDay("Today", 2), 2);
  assert.equal(parseDay("tomorrow", 6), 0);
  assert.equal(parseDay("7", 0), null);
  assert.equal(parseDay("piątek", 0), null);
  assert.equal(isRelativeDay(" TODAY "), true);
  assert.equal(isRelativeDay("monday"), false);
});

test("daySlots dopełnia brakujące lekcje pustą listą", () => {
  assert.deepEqual(
    daySlots(hours.slice(0, 2), [[{ subject: "a" }]]).map((s) => s.entries),
    [[{ subject: "a" }], []],
  );
});

test("nowState przed lekcjami wskazuje pierwszą lekcję", () => {
  const state = nowState(slots, 7 * 60 + 30);
  assert.equal(state.current, null);
  assert.equal(state.next?.number, 2);
  assert.equal(state.next.startsInMinutes, 80);
  assert.equal(state.isBreak, false);
  assert.equal(state.isOver, false);
});

test("nowState w trakcie lekcji liczy pozostały czas", () => {
  const state = nowState(slots, 9 * 60);
  assert.equal(state.current?.number, 2);
  assert.equal(state.current.minutesLeft, 35);
  assert.equal(state.next?.number, 4);
});

test("nowState w okienku zgłasza przerwę, po lekcjach koniec dnia", () => {
  assert.equal(nowState(slots, 10 * 60).isBreak, true);
  const after = nowState(slots, 12 * 60);
  assert.equal(after.isOver, true);
  assert.equal(after.next, null);
});

test("parseAt czyta czas lokalny jako warszawski, z offsetem dosłownie", () => {
  assert.equal(
    parseAt("2026-11-16T08:50")?.toISOString(),
    "2026-11-16T07:50:00.000Z",
  );
  assert.equal(
    parseAt("2026-07-01T08:50")?.toISOString(),
    "2026-07-01T06:50:00.000Z",
  );
  assert.equal(
    parseAt("2026-11-16")?.toISOString(),
    "2026-11-15T23:00:00.000Z",
  );
  assert.equal(
    parseAt("2026-11-16T08:50:00Z")?.toISOString(),
    "2026-11-16T08:50:00.000Z",
  );
  assert.equal(parseAt("2026-02-30T08:00"), null);
  assert.equal(parseAt("jutro"), null);
  assert.equal(parseAt("2026-11-16 08:50"), null);
});

test("warsawLocal przechodzi przez zmianę czasu", () => {
  assert.equal(
    warsawLocal(2026, 3, 29, 3, 0).toISOString(),
    "2026-03-29T01:00:00.000Z",
  );
  assert.equal(
    warsawLocal(2026, 10, 25, 12, 0).toISOString(),
    "2026-10-25T11:00:00.000Z",
  );
});

test("findNextLesson przeskakuje weekend i święta", () => {
  const week = [monday, [], [], [], []];
  const friday = parseAt("2026-11-13T12:00");
  assert.ok(friday);
  const next = findNextLesson(week, hours, friday);
  assert.equal(next?.slot.number, 2);
  assert.equal(next.date.toISOString().slice(0, 10), "2026-11-16");
  assert.equal(next.startsAt.toISOString(), "2026-11-16T07:50:00.000Z");
  assert.equal(next.startsInMinutes, 3 * 24 * 60 - 3 * 60 - 10);

  const tuesdayLesson = [[], monday];
  const beforeHoliday = parseAt("2026-11-09T12:00");
  assert.ok(beforeHoliday);
  assert.equal(
    findNextLesson([[], [], monday], hours, beforeHoliday)
      ?.date.toISOString()
      .slice(0, 10),
    "2026-11-18",
  );
  assert.equal(
    findNextLesson(tuesdayLesson, hours, beforeHoliday)
      ?.date.toISOString()
      .slice(0, 10),
    "2026-11-10",
  );
  assert.equal(findNextLesson([], hours, friday), null);
});

test("currentPeriod podaje lekcję albo najbliższą po przerwie", () => {
  assert.equal(currentPeriod(hours, 8 * 60 + 10)?.upcoming, false);
  assert.deepEqual(currentPeriod(hours, 9 * 60 + 40), {
    hour: hours[2],
    upcoming: true,
  });
  assert.equal(currentPeriod(hours, 12 * 60), null);
});

test("filterGroup zostawia wybraną grupę i lekcje całej klasy", () => {
  const filtered = filterGroup([monday], "1/2");
  assert.deepEqual(filtered[0]?.[3], [{ subject: "wf", groupName: "1/2" }]);
  assert.deepEqual(filtered[0][1], monday[1]);
  assert.equal(filterGroup([monday], null)[0], monday);
  assert.deepEqual(groupNames([monday]), ["1/2", "2/2"]);
});

test("subjectSummary liczy okresy, nie wpisy", () => {
  assert.deepEqual(subjectSummary([monday]), [
    {
      subject: "matma",
      periodsPerWeek: 1,
      teachers: [{ id: "7", name: "Ko" }],
      rooms: [],
      classes: [],
      groups: [],
    },
    {
      subject: "wf",
      periodsPerWeek: 1,
      teachers: [],
      rooms: [],
      classes: [],
      groups: ["1/2", "2/2"],
    },
  ]);
  assert.equal(busyPeriods([monday]), 2);
});

test("daty, godziny, zmiany i wyszukiwanie", () => {
  assert.equal(isoFromOptivum("14 listopada 2026"), "2026-11-14");
  assert.equal(isoFromOptivum(null), null);
  assert.equal(parseIsoDay("2026-02-30"), null);
  assert.equal(
    mondayOf(new Date("2026-11-15T00:00:00Z")).toISOString().slice(0, 10),
    "2026-11-09",
  );
  assert.equal(padTime("8:05"), "08:05");
  assert.deepEqual(parseChangeCell("matma|1/2|WJ|B17;wf|||"), [
    { subject: "matma", groupName: "1/2", teacher: "WJ", room: "B17" },
    { subject: "wf", groupName: null, teacher: null, room: null },
  ]);
  assert.equal(normalizeSearch("Łukasz Żółć"), "lukasz zolc");
});
