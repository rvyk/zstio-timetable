import { SCHOOL_SHORT } from "@/constants/school";
import { env } from "@/env";
import { isSchoolDayOff, schoolDaysOff } from "@/lib/schoolYear";
import type { OptivumTimetable } from "@/types/optivum";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import type * as ics from "ics";

const getDateOfNextWeekDayByIndex = (dayIndex: number) => {
  const date = new Date();
  const diff = (dayIndex + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);

  const asUtcDay = () =>
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  while (isSchoolDayOff(asUtcDay())) date.setDate(date.getDate() + 7);

  return date;
};

const getRRuleByDayIndex = (dayIndex: number) => {
  return (
    {
      1: "MO",
      2: "TU",
      3: "WE",
      4: "TH",
      5: "FR",
      6: "SA",
      7: "SU",
    }[dayIndex] ?? "MO"
  );
};

const EXCLUSION_WEEKS = 53;

const pad = (value: number) => String(value).padStart(2, "0");

const floatingDateTime = (date: Date, hours: number, minutes: number) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(hours)}${pad(minutes)}00`;

const parseTime = (timeStr: string) => {
  const [hours = 0, minutes = 0] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

const DEFAULT_LESSON_MINUTES = 45;

const lessonMinutes = (hour: TableHour) => {
  const from = parseTime(hour.timeFrom);
  const to = parseTime(hour.timeTo);
  const minutes = to.hours * 60 + to.minutes - (from.hours * 60 + from.minutes);

  return minutes > 0 ? minutes : DEFAULT_LESSON_MINUTES;
};

const createEvent = (
  group: TableLesson,
  dayIndex: number,
  hour: TableHour,
  daysOff: Date[],
  url: string,
  withAlarm: boolean,
) => {
  const date = getDateOfNextWeekDayByIndex(dayIndex + 1);
  const { hours: startHour, minutes: startMinute } = parseTime(hour.timeFrom);

  const start = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const exclusionDates = daysOff
    .filter(
      (dayOff) =>
        dayOff.getUTCDay() === (dayIndex + 1) % 7 && dayOff.getTime() > start,
    )
    .map((dayOff) => floatingDateTime(dayOff, startHour, startMinute));

  const { subject, groupName, className, teacher, room } = group;

  const title = groupName ? `${subject} (${groupName})` : subject;

  const description = [
    teacher && `Nauczyciel: ${teacher}`,
    room && `Sala: ${room}`,
    className && `Klasa: ${className}`,
    groupName && `Grupa: ${groupName}`,
  ]
    .filter(Boolean)
    .join("\n");

  const categories = [
    SCHOOL_SHORT,
    ...(className ? [className] : []),
    ...(groupName ? [groupName] : []),
  ];

  return {
    start: [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      startHour,
      startMinute,
    ],
    startInputType: "local",
    startOutputType: "local",
    title,
    description,
    url,
    location: room ? `Sala ${room}` : undefined,
    duration: { minutes: lessonMinutes(hour) },
    alarms: withAlarm
      ? [
          {
            action: "display",
            trigger: { minutes: 10, before: true },
          },
        ]
      : undefined,
    categories,
    recurrenceRule: `FREQ=WEEKLY;BYDAY=${getRRuleByDayIndex(dayIndex + 1)}`,
    exclusionDates,
  } as ics.EventAttributes;
};

export const getCalendar = async (timetable: OptivumTimetable) => {
  const { createEvents } = await import("ics");
  const events: ics.EventAttributes[] = [];
  const daysOff = schoolDaysOff(new Date(), EXCLUSION_WEEKS);
  const hours = Object.values(timetable.hours);
  const url = new URL(
    `${timetable.type}/${timetable.id.substring(1)}`,
    env.NEXT_PUBLIC_APP_URL,
  ).toString();

  const alarmedDays = new Set<number>();

  (timetable.lessons ?? []).forEach((day, dayIndex) => {
    day.forEach((lesson, lessonIndex) => {
      const hour = hours[lessonIndex];
      if (!hour) return;

      lesson.forEach((group) => {
        const withAlarm = !alarmedDays.has(dayIndex);
        alarmedDays.add(dayIndex);

        events.push(
          createEvent(group, dayIndex, hour, daysOff, url, withAlarm),
        );
      });
    });
  });

  return createEvents(events);
};
