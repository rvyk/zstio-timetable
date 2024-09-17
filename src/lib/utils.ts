import { daysOfWeek } from "@/constants/days-of-week";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: CREATE TESTS FOR THIS FUNCTION
export const getDayNumberForNextWeek = (dayName: string): string => {
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const targetDay = daysOfWeek.find(
    (day) => day.long === dayName || day.short === dayName,
  );

  if (!targetDay) {
    throw new Error(`Nieznany dzień: ${dayName}`);
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

  return targetDate.getDate().toString().padStart(2, "0");
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

//TODO: REFACTOR THIS FUNCTION
export const getCurrentLesson = (
  timeFrom: string,
  timeTo: string,
): { isWithinTimeRange: boolean; timeRemaining: string } => {
  const now = new Date();
  const [fromHour, fromMinutes] = timeFrom.split(":").map(Number);
  const [toHour, toMinutes] = timeTo.split(":").map(Number);

  const isAfterFromTime =
    now.getHours() > fromHour ||
    (now.getHours() === fromHour && now.getMinutes() >= fromMinutes);
  const isBeforeToTime =
    now.getHours() < toHour ||
    (now.getHours() === toHour && now.getMinutes() < toMinutes);

  const isWithinTimeRange = isAfterFromTime && isBeforeToTime;
  let timeRemaining = "00:00";

  if (isWithinTimeRange) {
    const endTime = new Date();
    endTime.setHours(toHour, toMinutes, 0, 0);

    const timeDifference = endTime.getTime() - now.getTime();
    const totalSecondsRemaining = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(totalSecondsRemaining / 60);
    const seconds = totalSecondsRemaining % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    timeRemaining = `${formattedMinutes}:${formattedSeconds}`;
  }

  return { isWithinTimeRange, timeRemaining };
};
