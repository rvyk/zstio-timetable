import assert from "node:assert/strict";
import test from "node:test";
import {
  formatOptivumDate,
  parseHeaderDate,
  parseOptivumDate,
  shiftTime,
} from "./dates.ts";

test("formatOptivumDate obsługuje ISO z getGeneratedDate", () => {
  assert.equal(formatOptivumDate("2026-03-08"), "8 marca 2026r.");
  assert.equal(formatOptivumDate("2026-12-31"), "31 grudnia 2026r.");
});

test("formatOptivumDate obsługuje polski zapis z getVersionInfo", () => {
  assert.equal(formatOptivumDate("9 marca 2026r."), "9 marca 2026r.");
  assert.equal(formatOptivumDate("1 września 2025r."), "1 września 2025r.");
});

test("formatOptivumDate zwraca null dla śmieci", () => {
  for (const raw of [null, undefined, "", "   ", "brak", "32 foo 2026"]) {
    assert.equal(formatOptivumDate(raw), null, `dla ${JSON.stringify(raw)}`);
  }
});

test("parseOptivumDate nie myli miesięcy", () => {
  assert.equal(parseOptivumDate("2026-01-05")?.getMonth(), 0);
  assert.equal(parseOptivumDate("5 stycznia 2026")?.getMonth(), 0);
  assert.equal(parseOptivumDate("5 grudnia 2026")?.getMonth(), 11);
});

test("parseHeaderDate formatuje w strefie Europe/Warsaw", () => {
  const res = new Response(null, {
    headers: { date: "Sat, 09 Aug 2026 12:34:56 GMT" },
  });
  // 12:34 UTC w sierpniu = 14:34 w Warszawie (UTC+2)
  assert.equal(parseHeaderDate(res), "09 sierpnia 2026r. 14:34:56");
});

test("parseHeaderDate radzi sobie z brakiem/niepoprawnym nagłówkiem", () => {
  assert.equal(parseHeaderDate(new Response(null)), "Brak danych");
  assert.equal(
    parseHeaderDate(new Response(null, { headers: { date: "nonsense" } })),
    "Brak danych",
  );
});

test("shiftTime dodaje minuty i uzupełnia zerami", () => {
  assert.equal(shiftTime("8:00", 5), "08:05");
  assert.equal(shiftTime("08:45", 5), "08:50");
  assert.equal(shiftTime("08:50", 30), "09:20");
  assert.equal(shiftTime("23:50", 30), "00:20");
});
