import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const daysOfWeek: { [key: string]: number } = {
  Poniedziałek: 1,
  Wtorek: 2,
  Środa: 3,
  Czwartek: 4,
  Piątek: 5,
  Sobota: 6,
  Niedziela: 0,
};

// TODO: CREATE TESTS FOR THIS FUNCTION
export const getDayNumberForNextWeek = (dayName: string): string => {
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const targetDayOfWeek = daysOfWeek[dayName];

  const daysUntilTarget = (targetDayOfWeek - todayDayOfWeek + 7) % 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);

  if (daysUntilTarget === 0 && todayDayOfWeek === targetDayOfWeek) {
    targetDate.setDate(today.getDate());
  } else if (targetDayOfWeek < todayDayOfWeek) {
    targetDate.setDate(today.getDate() - (todayDayOfWeek - targetDayOfWeek));
  }

  return targetDate.getDate().toString().padStart(2, "0");
};
