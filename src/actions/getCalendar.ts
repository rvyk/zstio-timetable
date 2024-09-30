"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import * as ics from "ics";
import { unstable_cache } from "next/cache";

const getDateOfNextWeekDayByIndex = (dayIndex: number) => {
  const date = new Date();
  const diff = (dayIndex + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
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

const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

const createEvent = (
  group: TableLesson,
  dayIndex: number,
  lessonIndex: number,
  hours: TableHour[],
) => {
  const date = getDateOfNextWeekDayByIndex(dayIndex + 1);
  const { hours: startHour, minutes: startMinute } = parseTime(
    hours[lessonIndex].timeFrom,
  );

  const { subject, groupName, className, teacher, room } = group;

  const title = groupName ? `${subject} (${groupName})` : subject;

  const description = [
    className && `🎓${className}`,
    teacher && `🧑‍🏫${teacher}`,
    room && `🏫${room}`,
  ]
    .filter(Boolean)
    .join(" ");

  const categories = [
    "ZSTiO",
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
    title,
    description,
    url: process.env.NEXT_PUBLIC_APP_URL,
    location: room ? `Sala: ${room}` : undefined,
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
  } as ics.EventAttributes;
};

const getIcs = (days: TableLesson[][][], hours: TableHour[]) => {
  const events: ics.EventAttributes[] = [];

  days.forEach((day, dayIndex) => {
    day.forEach((lesson, lessonIndex) => {
      lesson.forEach((group) => {
        events.push(createEvent(group, dayIndex, lessonIndex, hours));
      });
    });
  });

  return ics.createEvents(events);
};

export const getCalendar = unstable_cache(
  async (days: TableLesson[][][], hours: TableHour[]) =>
    await getIcs(days, hours),
  ["icsCalendar"],
  { revalidate: REVALIDATE_TIME },
);
