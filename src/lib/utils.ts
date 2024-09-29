import { daysOfWeek } from "@/constants/days";
import {
  Substitution,
  SubstitutionsPage,
} from "@majusss/substitutions-parser/dist/types";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import "moment-timezone";
import "moment/locale/pl";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseHeaderDate = (res: Response): string => {
  return res.headers.has("date")
    ? moment(res.headers.get("date"))
        .tz("Europe/Warsaw")
        .format("DD MMMM YYYY[r.] HH:mm:ss")
    : "Brak danych";
};

export const getDayNumberForNextWeek = (dayName: string): number => {
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const targetDay = daysOfWeek.find(
    (day) => day.long === dayName || day.short === dayName,
  );

  if (!targetDay) {
    return 0;
  }

  const targetDayOfWeek = targetDay.index + 1;

  const daysUntilTarget = (targetDayOfWeek - todayDayOfWeek + 7) % 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);

  if (daysUntilTarget === 0 && todayDayOfWeek === targetDayOfWeek) {
    targetDate.setDate(today.getDate());
  } else if (targetDayOfWeek < todayDayOfWeek) {
    targetDate.setDate(today.getDate() - (todayDayOfWeek - targetDayOfWeek));
  }

  return Number(targetDate.getDate());
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

export const getUniqueSubstitutionList = (
  type: "teacher" | "class",
  substitutions: SubstitutionsPage,
) => {
  const uniqueNames = Array.from(
    new Set(
      substitutions.tables.flatMap((t) => t.substitutions.map((s) => s[type])),
    ),
  );

  return uniqueNames
    .map((name) => ({ name, type }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const parseSubstitutionClass = (branch: string): string => {
  const regex = /(\w+)\|([^+]+)/g;
  let result = branch.replace(regex, "$1 ($2)");
  result = result.replace(/\+/g, " + ");
  return result.trim();
};

export const sortSubstitutions = (substitutions: Substitution[]) => {
  return substitutions
    .sort((a, b) => a.class.localeCompare(b.class))
    .sort((a, b) => a.number - b.number);
};
