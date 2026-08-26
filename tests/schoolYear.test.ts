import assert from "node:assert/strict";
import test from "node:test";
import {
  easterSunday,
  isSchoolDayOff,
  schoolDaysOff,
} from "../src/lib/schoolYear.ts";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

test("easterSunday zna daty Wielkanocy", () => {
  assert.equal(easterSunday(2026).toISOString().slice(0, 10), "2026-04-05");
  assert.equal(easterSunday(2027).toISOString().slice(0, 10), "2027-03-28");
});

test("isSchoolDayOff łapie święta i przerwy", () => {
  assert.equal(isSchoolDayOff(day("2026-12-25")), true);
  assert.equal(isSchoolDayOff(day("2026-12-28")), true);
  assert.equal(isSchoolDayOff(day("2026-04-02")), true);
  assert.equal(isSchoolDayOff(day("2026-04-06")), true);
  assert.equal(isSchoolDayOff(day("2026-06-04")), true);
  assert.equal(isSchoolDayOff(day("2026-06-29")), true);
  assert.equal(isSchoolDayOff(day("2026-07-15")), true);
  assert.equal(isSchoolDayOff(day("2026-11-11")), true);
  assert.equal(isSchoolDayOff(day("2027-01-18")), true);
  assert.equal(isSchoolDayOff(day("2027-01-29")), true);
});

test("isSchoolDayOff przepuszcza zwykłe dni nauki", () => {
  assert.equal(isSchoolDayOff(day("2026-09-01")), false);
  assert.equal(isSchoolDayOff(day("2026-12-22")), false);
  assert.equal(isSchoolDayOff(day("2026-06-19")), false);
  assert.equal(isSchoolDayOff(day("2026-06-26")), false);
  assert.equal(isSchoolDayOff(day("2026-04-08")), false);
  assert.equal(isSchoolDayOff(day("2027-01-15")), false);
  assert.equal(isSchoolDayOff(day("2027-02-01")), false);
});

test("schoolDaysOff zwraca dni wolne z zakresu", () => {
  const days = schoolDaysOff(day("2026-12-21"), 2);
  const dates = days.map((entry) => entry.toISOString().slice(0, 10));

  assert.deepEqual(dates, [
    "2026-12-23",
    "2026-12-24",
    "2026-12-25",
    "2026-12-26",
    "2026-12-27",
    "2026-12-28",
    "2026-12-29",
    "2026-12-30",
    "2026-12-31",
    "2027-01-01",
    "2027-01-02",
    "2027-01-03",
  ]);
});
