"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import db from "@/lib/redis";
import { parseHeaderDate } from "@/lib/utils";
import { OptivumTimetable, TimetableDiffMatrix } from "@/types/optivum";
import { Table, TableLesson } from "@majusss/timetable-parser";
import deepDiff, { diff } from "deep-diff";
import moment from "moment";
import "moment/locale/pl";
import { getOptivumList } from "./getOptivumList";

const processDiffs = (
  diffs: deepDiff.Diff<OptivumTimetable, OptivumTimetable>[],
): TimetableDiffMatrix => {
  const timetableDiffs: TimetableDiffMatrix = [];

  for (const difference of diffs) {
    const { kind, path } = difference;
    if (!path || path[0] !== "lessons") continue;

    const [day, lesson, group, type] = path.slice(1);
    if (typeof type !== "string") continue;

    if (!timetableDiffs[day]) timetableDiffs[day] = [];
    if (!timetableDiffs[day][lesson]) timetableDiffs[day][lesson] = [];
    if (!timetableDiffs[day][lesson][group])
      timetableDiffs[day][lesson][group] = {};

    timetableDiffs[day][lesson][group][type as keyof TableLesson] = {
      kind,
      newValue: "rhs" in difference ? String(difference.rhs) : undefined,
      oldValue: "lhs" in difference ? String(difference.lhs) : undefined,
    };
  }

  return timetableDiffs;
};

const getTimetableData = async (
  type: string,
  index: string,
  getFuture: boolean,
) => {
  const id =
    {
      class: `o${index}`,
      teacher: `n${index}`,
      room: `s${index}`,
    }[type] ?? "";

  const baseUrl =
    process.env.NEXT_PUBLIC_TIMETABLE_URL?.replace(/\/+$/, "") ?? "";
  const url = `${getFuture ? baseUrl.replace(/[^/]+$/, "nowy-plan") : baseUrl}/plany/${id}.html`;

  const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
  const data = await res.text();
  const timeTableData = new Table(data);

  return {
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
    lastUpdated: parseHeaderDate(res),
    lastModified: res.headers.get("last-modified")
      ? new Date(res.headers.get("last-modified")!).getTime()
      : -1,
  };
};

export const getOptivumTimetable = async (
  type: string,
  index: string,
  getFuture: boolean = false,
): Promise<OptivumTimetable> => {
  try {
    const { id, lastUpdated, lastModified, ...finalData } =
      await getTimetableData(type, index, getFuture);

    if (getFuture) {
      return {
        id,
        ...finalData,
        lastUpdated,
        lastModified,
        isNewReliable: false,
      };
    }

    const [futureData, old] = await Promise.all([
      getOptivumTimetable(type, index, true),
      db.get(`timetable:${id}`),
    ]);

    if (!old) {
      await db.set(
        `timetable:${id}`,
        JSON.stringify({
          ...finalData,
          lastModified,
        }),
      );
    }

    const futureDiffs = diff(finalData as OptivumTimetable, futureData);
    if (futureDiffs) {
      return {
        id,
        ...finalData,
        lastUpdated,
        lastModified,
        diffs: processDiffs(futureDiffs),
        isNewReliable: true,
      };
    }

    if (old) {
      const oldData = JSON.parse(old) as OptivumTimetable;
      if (lastModified !== -1 && oldData.lastModified !== lastModified) {
        await db.set(
          `timetable:${id}`,
          JSON.stringify({
            ...finalData,
            lastModified,
          }),
        );
      }

      const oldDiffs = diff(oldData, finalData as OptivumTimetable);
      if (oldDiffs) {
        return {
          id,
          ...finalData,
          lastUpdated,
          lastModified,
          diffs: processDiffs(oldDiffs),
          isNewReliable: false,
        };
      }
    }

    return {
      id,
      ...finalData,
      lastUpdated,
      lastModified,
      diffs: [],
      isNewReliable: false,
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    return {} as OptivumTimetable;
  }
};
