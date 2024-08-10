import { TableLesson } from "@wulkanowy/timetable-parser";
import * as ics from "ics";
import { RRule } from "rrule";
import { normalHours } from "./utils";

const getDateOfNextWeekDayByIndex = (dayIndex: number) => {
  const date = new Date();
  const today = date.getDay();
  const diff = dayIndex - today;
  date.setDate(date.getDate() + (diff >= 0 ? diff : diff + 7));
  return date;
};

const getRRuleByDayIndex = (dayIndex: number) => {
  switch (dayIndex) {
    case 1: // Poniedziałek
      return RRule.MO;
    case 2: // Wtorek
      return RRule.TU;
    case 3: // Środa
      return RRule.WE;
    case 4: // Czwartek
      return RRule.TH;
    case 5: // Piątek
      return RRule.FR;
    default:
      return RRule.MO;
  }
};

export const getIcs = (days: TableLesson[][][]) => {
  const events: ics.EventAttributes[] = days.flatMap((day, dayI) =>
    day.flatMap((lesson, lessonI) =>
      lesson.map((group) => {
        const date = getDateOfNextWeekDayByIndex(dayI + 1);
        return {
          start: [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            +normalHours[lessonI].timeFrom.split(":")[0],
            +normalHours[lessonI].timeFrom.split(":")[1],
          ],
          title: group.groupName
            ? `${group.subject} (${group.groupName})`
            : group.subject,
          description: `${group.className ? `🎓${group.className}` : ""} ${group.teacher ? `🧑‍🏫${group.teacher}` : ""}  ${group.room ? `🏫${group.room}` : ""}`,
          url: process.env.NEXT_PUBLIC_HOST,
          location: group.room && `Sala: ${group.room}`,
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
          categories: [
            "ZSTiO",
            ...(group.className ? [group.className] : []),
            ...(group.groupName ? [group.groupName] : []),
          ],
          recurrenceRule: new RRule({
            freq: RRule.WEEKLY,
            byweekday: [getRRuleByDayIndex(dayI + 1)],
          })
            .toString()
            .replace("RRULE:", ""),
        } as ics.EventAttributes;
      }),
    ),
  );
  return ics.createEvents(events);
};
