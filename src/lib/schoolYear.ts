const utcDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day));

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 86400000);

const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

const isBetween = (date: Date, from: Date, to: Date) =>
  date >= from && date <= to;

const EXTRA_DAYS_OFF: [string, string][] = [
  ["2027-01-18", "2027-01-31"], // ferie zimowe, podkarpackie
];

const FIXED_HOLIDAYS = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 24],
  [12, 25],
  [12, 26],
] as const;

export const easterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return utcDate(year, month, day);
};

export const lastSchoolDay = (year: number): Date => {
  const june20 = utcDate(year, 6, 20);
  return addDays(june20, (5 - june20.getUTCDay() + 7) % 7 || 7);
};

export const isSchoolDayOff = (date: Date): boolean => {
  const day = utcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
  const year = day.getUTCFullYear();
  const weekday = day.getUTCDay();

  if (weekday === 0 || weekday === 6) return true;

  if (
    FIXED_HOLIDAYS.some(([month, dayOfMonth]) =>
      isSameDay(day, utcDate(year, month, dayOfMonth)),
    )
  ) {
    return true;
  }

  const easter = easterSunday(year);
  if (isBetween(day, addDays(easter, -3), addDays(easter, 2))) return true;
  if (isSameDay(day, addDays(easter, 60))) return true;

  if (isBetween(day, utcDate(year, 12, 23), utcDate(year, 12, 31))) return true;
  if (isBetween(day, addDays(lastSchoolDay(year), 1), utcDate(year, 8, 31)))
    return true;

  return EXTRA_DAYS_OFF.some(([from, to]) =>
    isBetween(day, new Date(`${from}T00:00:00Z`), new Date(`${to}T00:00:00Z`)),
  );
};

export const schoolDaysOff = (start: Date, weeks: number): Date[] => {
  const days: Date[] = [];
  const from = utcDate(
    start.getUTCFullYear(),
    start.getUTCMonth() + 1,
    start.getUTCDate(),
  );

  for (let offset = 0; offset < weeks * 7; offset++) {
    const day = addDays(from, offset);
    if (isSchoolDayOff(day)) days.push(day);
  }

  return days;
};
