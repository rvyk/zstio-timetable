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
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

const createEvent = (
  group: TableLesson,
  dayIndex: number,
  hour: TableHour,
  daysOff: Date[],
  url: string,
) => {
  const date = getDateOfNextWeekDayByIndex(dayIndex + 1);
  const { hours: startHour = 0, minutes: startMinute = 0 } = parseTime(
    hour.timeFrom,
  );

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
    duration: { minutes: 45 },
    alarms: [
      {
        action: "display",
        trigger: {
          minutes: 3,
          before: true,
        },
      },
    ],
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

  (timetable.lessons ?? []).forEach((day, dayIndex) => {
    day.forEach((lesson, lessonIndex) => {
      const hour = hours[lessonIndex];
      if (!hour) return;

      lesson.forEach((group) => {
        events.push(createEvent(group, dayIndex, hour, daysOff, url));
      });
    });
  });

  return createEvents(events);
};
