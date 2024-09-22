import { daysOfWeek } from "@/constants/days-of-week";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  return Number(targetDate.getDate().toString().padStart(2, "0"));
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

  return uniqueNames.map((name) => ({ name, type }));
};

export const parseSubstitutionClass = (branch: string): string => {
  const regex = /(\w+)\|([^+]+)/g;
  let result = branch.replace(regex, "$1 ($2)");
  result = result.replace(/\+/g, " + ");
  return result.trim();
};
