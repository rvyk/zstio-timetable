const OPTIVUM_DATE = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const HEADER_DATE = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const POLISH_MONTHS = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const parts = (formatter: Intl.DateTimeFormat, date: Date) =>
  Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  ) as Record<Intl.DateTimeFormatPartTypes, string>;

const WARSAW_YMD = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const warsawToday = (at: Date = new Date()): Date => {
  const { year, month, day } = parts(WARSAW_YMD, at);
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
};

const WARSAW_HM = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const WARSAW_FULL = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const warsawOffset = (instant: number): number => {
  const { year, month, day, hour, minute, second } = parts(
    WARSAW_FULL,
    new Date(instant),
  );
  const local = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  return local - Math.floor(instant / 1000) * 1000;
};

export const warsawLocal = (
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
): Date => {
  const guess = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const first = guess - warsawOffset(guess);

  return new Date(guess - warsawOffset(first));
};

export const warsawMinutes = (at: Date = new Date()): number => {
  const { hour, minute } = parts(WARSAW_HM, at);
  return Number(hour) * 60 + Number(minute);
};

export const warsawDayIndex = (at?: Date): number =>
  (warsawToday(at).getUTCDay() + 6) % 7;

export const parseOptivumDate = (raw: string): Date | null => {
  const trimmed = raw.trim();

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (iso) {
    const [, year, month, day] = iso;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const polish = /^(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(\d{4})/i.exec(trimmed);
  if (!polish) return null;

  const [, day, monthName, year] = polish;

  const monthIndex = POLISH_MONTHS.indexOf(monthName?.toLowerCase() ?? "");
  if (monthIndex === -1) return null;

  return new Date(Number(year), monthIndex, Number(day));
};

export const formatOptivumDate = (raw?: string | null): string | null => {
  if (!raw) return null;

  const date = parseOptivumDate(raw);
  if (!date || Number.isNaN(date.getTime())) return null;

  return OPTIVUM_DATE.format(date);
};

export const parseHeaderDate = (res: Response): string => {
  const headerDate = res.headers.get("date");
  if (!headerDate) return "Brak danych";

  const date = new Date(headerDate);
  if (Number.isNaN(date.getTime())) return "Brak danych";

  const { day, month, year, hour, minute, second } = parts(HEADER_DATE, date);

  return `${day} ${month} ${year} ${hour}:${minute}:${second}`;
};

export const shiftTime = (time: string, minutes: number): string => {
  const [hours = 0, mins = 0] = time.split(":").map(Number);
  const total = (((hours * 60 + mins + minutes) % 1440) + 1440) % 1440;

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
};
