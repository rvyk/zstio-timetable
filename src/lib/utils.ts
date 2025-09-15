import { DAYS_OF_WEEK } from "@/constants/days";
import { clsx, type ClassValue } from "clsx";
import { setCookie } from "cookies-next";
import moment from "moment";
import "moment-timezone";
import "moment/locale/pl";
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

export const parseHeaderDate = (res: Response): string => {
  return res.headers.has("date")
    ? moment(res.headers.get("date"))
        .tz("Europe/Warsaw")
        .format("DD MMMM YYYY[r.] HH:mm:ss")
    : "Brak danych";
};

export const getDayNumberForNextWeek = (
  dayName: string,
): {
  dayNumber: number;
  month: string;
  monthNumber: number;
} => {
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;

  const targetDay = DAYS_OF_WEEK.find(
    (day) => day.long === dayName || day.short === dayName,
  );

  if (!targetDay) {
    console.error("Day not found");
    return {
      dayNumber: today.getDate(),
      month: moment(today).format("MMM"),
      monthNumber: today.getMonth() + 1,
    };
  }

  let diff = targetDay.index - todayIndex;
  if (diff < 0) diff += 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  return {
    dayNumber: targetDate.getDate(),
    month: moment(targetDate).format("MMM") + ".",
    monthNumber: targetDate.getMonth() + 1,
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
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};
