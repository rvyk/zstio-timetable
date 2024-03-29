import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const days = [
  { long: "Poniedziałek", short: "Pon.", index: 0 },
  { long: "Wtorek", short: "Wt.", index: 1 },
  { long: "Środa", short: "Śr.", index: 2 },
  { long: "Czwartek", short: "Czw.", index: 3 },
  { long: "Piątek", short: "Pt.", index: 4 },
];

export const cases = [
  "Uczniowie przychodzą później",
  "Przeniesiona",
  "Okienko dla uczniów",
  "Uczniowie zwolnieni do domu",
];

export const normalHours: hourType[] = [
  {
    number: 1,
    timeFrom: "8:00",
    timeTo: "8:45",
  },
  {
    number: 2,
    timeFrom: "8:50",
    timeTo: "9:35",
  },
  {
    number: 3,
    timeFrom: "9:40",
    timeTo: "10:25",
  },
  {
    number: 4,
    timeFrom: "10:40",
    timeTo: "11:25",
  },
  {
    number: 5,
    timeFrom: "11:30",
    timeTo: "12:15",
  },
  {
    number: 6,
    timeFrom: "12:20",
    timeTo: "13:05",
  },
  {
    number: 7,
    timeFrom: "13:10",
    timeTo: "13:55",
  },
  {
    number: 8,
    timeFrom: "14:00",
    timeTo: "14:45",
  },
  {
    number: 9,
    timeFrom: "14:50",
    timeTo: "15:35",
  },
  {
    number: 10,
    timeFrom: "15:40",
    timeTo: "16:25",
  },
  {
    number: 11,
    timeFrom: "16:35",
    timeTo: "17:20",
  },
  {
    number: 12,
    timeFrom: "17:25",
    timeTo: "18:10",
  },
  {
    number: 13,
    timeFrom: "18:15",
    timeTo: "19:00",
  },
  {
    number: 14,
    timeFrom: "19:05",
    timeTo: "19:50",
  },
];

export const shortHours: hourType[] = [
  {
    number: 1,
    timeFrom: "8:00",
    timeTo: "8:30",
  },
  {
    number: 2,
    timeFrom: "8:35",
    timeTo: "9:05",
  },
  {
    number: 3,
    timeFrom: "9:10",
    timeTo: "9:40",
  },
  {
    number: 4,
    timeFrom: "9:45",
    timeTo: "10:15",
  },
  {
    number: 5,
    timeFrom: "10:30",
    timeTo: "11:00",
  },
  {
    number: 6,
    timeFrom: "11:05",
    timeTo: "11:35",
  },
  {
    number: 7,
    timeFrom: "11:40",
    timeTo: "12:10",
  },
  {
    number: 8,
    timeFrom: "12:15",
    timeTo: "12:45",
  },
  {
    number: 9,
    timeFrom: "12:50",
    timeTo: "13:20",
  },
  {
    number: 10,
    timeFrom: "13:25",
    timeTo: "13:55",
  },
  {
    number: 11,
    timeFrom: "14:00",
    timeTo: "14:30",
  },
  {
    number: 12,
    timeFrom: "14:35",
    timeTo: "15:05",
  },
  {
    number: 13,
    timeFrom: "15:10",
    timeTo: "15:40",
  },
  {
    number: 14,
    timeFrom: "15:45",
    timeTo: "16:15",
  },
];

export const adjustShortenedLessons = (
  startIndex: number,
  defaultHours: hourType[],
): hourType[] => {
  const adjustedShortenedLessons: hourType[] = [];

  for (let i = 0; i < defaultHours.length; i++) {
    const hour = defaultHours[i];
    const previousHour =
      adjustedShortenedLessons[i - 1] || defaultHours[i - 1] || null;

    if (Number(hour.number) > startIndex) {
      const newHour: hourType = {
        number: hour.number,
        timeFrom: addMinutes(previousHour.timeTo, 5),
        timeTo: addMinutes(previousHour.timeTo, 35),
      };
      adjustedShortenedLessons.push(newHour);
    } else {
      adjustedShortenedLessons.push(hour);
    }
  }

  return adjustedShortenedLessons;
};

const addMinutes = (time: string, minutes: number): string => {
  const [hours, minutesPart] = time.split(":");
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutesPart) + minutes;
  const adjustedHours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const adjustedMinutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${adjustedHours}:${adjustedMinutes}`;
};

export const getCurrentLesson = (
  timeFrom: string,
  timeTo: string,
): { isWithinTimeRange: boolean; minutesRemaining: number } => {
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();

  const [fromHour, fromMinutes] = timeFrom?.split(":");
  const [toHour, toMinutes] = timeTo?.split(":");
  let minutesRemaining = 0,
    isWithinTimeRange = false;
  const isAfterFromTime =
    currentHour > Number(fromHour) ||
    (currentHour === Number(fromHour) && currentMinutes >= Number(fromMinutes));
  const isBeforeToTime =
    currentHour < Number(toHour) ||
    (currentHour === Number(toHour) && currentMinutes < Number(toMinutes));
  isWithinTimeRange = isAfterFromTime && isBeforeToTime;

  if (isWithinTimeRange) {
    const endTime = new Date();
    endTime.setHours(Number(toHour), Number(toMinutes), 0);
    const timeDifference = endTime.getTime() - new Date().getTime();
    minutesRemaining = Math.ceil(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
  }

  return { isWithinTimeRange, minutesRemaining };
};
