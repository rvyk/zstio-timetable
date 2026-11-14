import type { TableHour, TableLesson } from "@majusss/timetable-parser";
import {
  parseOptivumDate,
  warsawDayIndex,
  warsawLocal,
  warsawMinutes,
  warsawToday,
} from "./dates.ts";
import { isSchoolDayOff } from "./schoolYear.ts";

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const isRelativeDay = (raw: string) =>
  ["today", "tomorrow"].includes(raw.trim().toLowerCase());

export const parseDay = (raw: string, todayIndex: number): number | null => {
  const value = raw.trim().toLowerCase();
  if (value === "today") return todayIndex;
  if (value === "tomorrow") return (todayIndex + 1) % 7;
  if (/^[0-6]$/.test(value)) return Number(value);

  const index = DAY_KEYS.indexOf(value as (typeof DAY_KEYS)[number]);
  return index === -1 ? null : index;
};

export const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const pad = (value: number) => String(value).padStart(2, "0");

export const padTime = (time: string) => {
  const minutes = toMinutes(time);
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

export const padHours = (hours: TableHour[]): TableHour[] =>
  hours.map((hour) => ({
    ...hour,
    timeFrom: padTime(hour.timeFrom),
    timeTo: padTime(hour.timeTo),
  }));

export const isoDay = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

export const isoFromOptivum = (formatted: string | null): string | null => {
  const date = formatted ? parseOptivumDate(formatted) : null;
  if (!date || Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const parseIsoDay = (raw: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const date = new Date(`${raw}T00:00:00Z`);

  return Number.isNaN(date.getTime()) || isoDay(date) !== raw ? null : date;
};

const LOCAL_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/;

export const parseAt = (raw: string | null, now = new Date()): Date | null => {
  if (!raw) return now;

  const local = LOCAL_DATE_TIME.exec(raw.trim());
  if (local) {
    const [, year, month, day, hours = "0", minutes = "0", seconds = "0"] =
      local;
    if (!parseIsoDay(`${year}-${month}-${day}`)) return null;
    if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59) {
      return null;
    }

    return warsawLocal(
      Number(year),
      Number(month),
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    );
  }

  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw.trim())) return null;
  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const warsawAt = (at: Date) => ({
  date: warsawToday(at),
  dayIndex: warsawDayIndex(at),
  minutes: warsawMinutes(at),
});

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 86_400_000);

export const mondayOf = (date: Date) =>
  addDays(date, -((date.getUTCDay() + 6) % 7));

export const lessonStart = (date: Date, time: string) => {
  const minutes = toMinutes(time);

  return warsawLocal(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    Math.floor(minutes / 60),
    minutes % 60,
  );
};

export const filterGroup = (
  lessons: TableLesson[][][] = [],
  group: string | null,
): TableLesson[][][] =>
  group
    ? lessons.map((day) =>
        day.map((entries) =>
          entries.filter(
            (entry) =>
              !entry.groupName ||
              entry.groupName.toLowerCase() === group.toLowerCase(),
          ),
        ),
      )
    : lessons;

export const groupNames = (lessons: TableLesson[][][] = []) =>
  [
    ...new Set(
      lessons
        .flat(2)
        .map((entry) => entry.groupName)
        .filter((name): name is string => Boolean(name)),
    ),
  ].sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));

export interface ApiSlot extends TableHour {
  entries: TableLesson[];
}

export const daySlots = (
  hours: TableHour[],
  day: TableLesson[][] = [],
): ApiSlot[] =>
  hours.map((hour, index) => ({ ...hour, entries: day[index] ?? [] }));

export const nowState = (slots: ApiSlot[], minutes: number) => {
  const lessons = slots.filter((slot) => slot.entries.length > 0);
  const current =
    lessons.find(
      (slot) =>
        toMinutes(slot.timeFrom) <= minutes && minutes < toMinutes(slot.timeTo),
    ) ?? null;
  const next =
    lessons.find((slot) => toMinutes(slot.timeFrom) > minutes) ?? null;
  const hadLesson = lessons.some((slot) => toMinutes(slot.timeTo) <= minutes);

  return {
    current: current && {
      ...current,
      minutesLeft: toMinutes(current.timeTo) - minutes,
    },
    next: next && {
      ...next,
      startsInMinutes: toMinutes(next.timeFrom) - minutes,
    },
    isBreak: !current && hadLesson && next !== null,
    isOver: lessons.length > 0 && !current && next === null,
  };
};

export const NEXT_LESSON_HORIZON_DAYS = 120;

export const findNextLesson = (
  lessons: TableLesson[][][],
  hours: TableHour[],
  at: Date,
) => {
  const { date: today, minutes } = warsawAt(at);

  for (let offset = 0; offset < NEXT_LESSON_HORIZON_DAYS; offset++) {
    const date = addDays(today, offset);
    if (isSchoolDayOff(date)) continue;

    const dayIndex = (date.getUTCDay() + 6) % 7;
    const slot = daySlots(hours, lessons[dayIndex]).find(
      (candidate) =>
        candidate.entries.length > 0 &&
        (offset > 0 || toMinutes(candidate.timeFrom) > minutes),
    );

    if (slot) {
      const start = lessonStart(date, slot.timeFrom);
      return {
        date,
        dayIndex,
        slot,
        startsAt: start,
        startsInMinutes: Math.round((start.getTime() - at.getTime()) / 60_000),
      };
    }
  }

  return null;
};

export const currentPeriod = (hours: TableHour[], minutes: number) => {
  const current = hours.find(
    (hour) =>
      toMinutes(hour.timeFrom) <= minutes && minutes < toMinutes(hour.timeTo),
  );
  if (current) return { hour: current, upcoming: false };

  const next = hours.find((hour) => toMinutes(hour.timeFrom) > minutes);
  return next ? { hour: next, upcoming: true } : null;
};

interface Ref {
  id: string | null;
  name: string;
}

const addRef = (refs: Map<string, Ref>, name?: string, id?: string) => {
  if (name) refs.set(name, { id: id ?? null, name });
};

const sortedRefs = (refs: Map<string, Ref>) =>
  [...refs.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "pl", { numeric: true }),
  );

export const subjectSummary = (lessons: TableLesson[][][] = []) => {
  const subjects = new Map<
    string,
    {
      periods: Set<string>;
      teachers: Map<string, Ref>;
      rooms: Map<string, Ref>;
      classes: Map<string, Ref>;
      groups: Set<string>;
    }
  >();

  lessons.forEach((day, dayIndex) =>
    day.forEach((entries, hourIndex) =>
      entries.forEach((entry) => {
        const summary = subjects.get(entry.subject) ?? {
          periods: new Set(),
          teachers: new Map(),
          rooms: new Map(),
          classes: new Map(),
          groups: new Set(),
        };
        summary.periods.add(`${dayIndex}:${hourIndex}`);
        addRef(summary.teachers, entry.teacher, entry.teacherId);
        addRef(summary.rooms, entry.room, entry.roomId);
        addRef(summary.classes, entry.className, entry.classId);
        if (entry.groupName) summary.groups.add(entry.groupName);
        subjects.set(entry.subject, summary);
      }),
    ),
  );

  return [...subjects]
    .map(([subject, summary]) => ({
      subject,
      periodsPerWeek: summary.periods.size,
      teachers: sortedRefs(summary.teachers),
      rooms: sortedRefs(summary.rooms),
      classes: sortedRefs(summary.classes),
      groups: [...summary.groups].sort(),
    }))
    .sort(
      (a, b) =>
        b.periodsPerWeek - a.periodsPerWeek ||
        a.subject.localeCompare(b.subject),
    );
};

export const busyPeriods = (lessons: TableLesson[][][] = []) =>
  lessons.flat().filter((entries) => entries.length > 0).length;

export const parseChangeCell = (cell: string) =>
  cell
    .split(";")
    .filter(Boolean)
    .map((entry) => {
      const [subject = "", groupName = "", teacher = "", room = ""] =
        entry.split("|");

      return {
        subject,
        groupName: groupName || null,
        teacher: teacher || null,
        room: room || null,
      };
    });
