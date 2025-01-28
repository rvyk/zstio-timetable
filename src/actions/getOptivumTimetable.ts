"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import db from "@/lib/redis";
import { parseHeaderDate } from "@/lib/utils";
import {
  OptivumTimetable,
  TimetableDiff,
  TimetableDiffMatrix,
} from "@/types/optivum";
import { Table, TableLesson } from "@majusss/timetable-parser";
import { diff } from "deep-diff";
import moment from "moment";
import "moment/locale/pl";
import { getOptivumList } from "./getOptivumList";

export const getOptivumTimetable = async (
  type: string,
  index: string,
  getFuture: boolean = false,
): Promise<OptivumTimetable> => {
  const id =
    {
      class: `o${index}`,
      teacher: `n${index}`,
      room: `s${index}`,
    }[type] ?? "";

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_TIMETABLE_URL?.replace(/\/+$/, "") ?? "";
    const url = `${getFuture ? baseUrl.replace(/[^/]+$/, "nowy-plan") : baseUrl}/plany/${id}.html`;

    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });

    const data = await res.text();
    const timeTableData = new Table(data);

    const finalData = {
      id,
      hours: timeTableData.getHours(),
      lessons: timeTableData.getDays(),
      generatedDate: moment(timeTableData.getGeneratedDate())
        .locale("pl")
        .format("DD MMMM YYYY[r.]"),
      title: timeTableData.getTitle(),
      type: type as OptivumTimetable["type"],
      validDate: timeTableData.getVersionInfo(),
      dayNames: timeTableData.getDayNames(),
      list: await getOptivumList(),
    };

    const old = await db.get(`timetable:${id}`);

    if (old) {
      const oldData = JSON.parse(old) as OptivumTimetable;
      const diffs = diff(oldData, finalData);
      if (diffs) {
        const timetableDiffs: TimetableDiffMatrix = [];
        for (const diff of diffs) {
          const { kind, path } = diff;
          const isLessons = path?.shift() === "lessons";
          if (!isLessons) continue;
          const type = path.pop();
          if (typeof type != "string") continue;
          const [day, lesson, group] = path;

          if (!timetableDiffs[day]) timetableDiffs[day] = [];
          if (!timetableDiffs[day][lesson]) timetableDiffs[day][lesson] = [];
          if (!timetableDiffs[day][lesson][group])
            timetableDiffs[day][lesson][group] = {};

          console.log(timetableDiffs);

          timetableDiffs[day][lesson][group][type as keyof TableLesson] = {
            kind,
            newValue: "rhs" in diff ? String(diff.rhs) : undefined,
            oldValue: "lhs" in diff ? String(diff.lhs) : undefined,
          } as TimetableDiff;
        }
        return {
          lastUpdated: parseHeaderDate(res),
          diffs: timetableDiffs,
          ...finalData,
        };
      }
    }

    // db.set(`timetable:${id}`, JSON.stringify(finalData));

    return {
      lastUpdated: parseHeaderDate(res),
      ...finalData,
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    return {} as OptivumTimetable;
  }
};
