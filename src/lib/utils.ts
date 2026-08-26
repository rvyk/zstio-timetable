import { DAYS_OF_WEEK } from "@/constants/days";
import { warsawDayIndex, warsawToday } from "@/lib/dates";
import type { TableHour } from "@majusss/timetable-parser";
import { clsx, type ClassValue } from "clsx";
import { setCookie } from "cookies-next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setLastVisitedCookie = (link: string) => {
  setCookie("lastVisited", link, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const SHORT_MONTH = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "UTC",
  month: "short",
});

export const getDayNumberForNextWeek = (
  dayName: string,
): {
  dayNumber: number;
  month: string;
  monthNumber: number;
} => {
  const today = warsawToday();
  const todayIndex = warsawDayIndex();

  const targetDay = DAYS_OF_WEEK.find(
    (day) => day.long === dayName || day.short === dayName,
  );

  if (!targetDay) {
    console.error("Day not found");
    return {
      dayNumber: today.getUTCDate(),
      month: `${SHORT_MONTH.format(today)}.`,
      monthNumber: today.getUTCMonth() + 1,
    };
  }

  let diff = targetDay.index - todayIndex;
  if (diff < 0) diff += 7;

  const targetDate = new Date(today);
  targetDate.setUTCDate(today.getUTCDate() + diff);

  return {
    dayNumber: targetDate.getUTCDate(),
    month: `${SHORT_MONTH.format(targetDate)}.`,
    monthNumber: targetDate.getUTCMonth() + 1,
  };
};

export const simulateKeyPress = (key: string, keyCode: number) => {
  const event = new KeyboardEvent("keydown", {
    key,
    code: key,
    keyCode,
    which: keyCode,
    bubbles: true,
  });

  document.dispatchEvent(event);
};

export const parseTime = (timeStr: string): number => {
  const [hours = 0, minutes = 0] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

export const currentLessonIndex = (hours: TableHour[]): number | null => {
  const now = new Date();
  const seconds = now.getHours() * 3600 + now.getMinutes() * 60;
  const index = hours.findIndex((hour) => seconds < parseTime(hour.timeTo));

  return index === -1 ? null : index;
};
