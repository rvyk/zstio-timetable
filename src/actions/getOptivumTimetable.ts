"use server";

import { NEW_TIMETABLE_PREFIX, REVALIDATE_TIME } from "@/constants/settings";
import db, { isRedisConnected } from "@/lib/redis";
import { parseHeaderDate } from "@/lib/utils";
import { OptivumTimetable, TimetableDiffsProp } from "@/types/optivum";
import { Table, TableLesson } from "@majusss/timetable-parser";
import deepDiff, { diff } from "deep-diff";
import moment from "moment";
import "moment/locale/pl";
import { getOptivumList } from "./getOptivumList";

const processDiffs = (
  diffs: deepDiff.Diff<OptivumTimetable, OptivumTimetable>[],
  isNewReliable: boolean,
): TimetableDiffsProp => {
  const lessonDiffs: TimetableDiffsProp["lessons"] = [];

  let generatedDateDiff = undefined;
  let validDateDiff = undefined;

  for (const difference of diffs) {
    const { kind, path } = difference;
    if (!path) continue;
    switch (path.shift()) {
      case "generatedDate":
        generatedDateDiff = {
          kind,
          newValue: "rhs" in difference ? String(difference.rhs) : undefined,
          oldValue: "lhs" in difference ? String(difference.lhs) : undefined,
        };
        continue;
      case "validDate":
        validDateDiff = {
          kind,
          newValue: "rhs" in difference ? String(difference.rhs) : undefined,
          oldValue: "lhs" in difference ? String(difference.lhs) : undefined,
        };
        continue;
      case "lessons":
        if("item" in difference) {
          const [day, lesson,] = path;
  
          if (!lessonDiffs[day]) lessonDiffs[day] = [];
          if (!lessonDiffs[day][lesson]) lessonDiffs[day][lesson] = [];
          if (!lessonDiffs[day][lesson][0])
            lessonDiffs[day][lesson][0] = {};
  
          lessonDiffs[day][lesson][0]["subject"] = {
            kind: difference.item.kind,
            newValue: "rhs" in difference.item ? ("subject" in difference.item.rhs ? String(difference.item.rhs.subject) : undefined) : undefined,
            oldValue: "lhs" in difference.item ? ("subject" in difference.item.lhs ? String(difference.item.lhs.subject) : undefined) : undefined,
          };
          continue;
        }
        const [day, lesson, group, type] = path;
        if (typeof type !== "string") continue;

        if (!lessonDiffs[day]) lessonDiffs[day] = [];
        if (!lessonDiffs[day][lesson]) lessonDiffs[day][lesson] = [];
        if (!lessonDiffs[day][lesson][group])
          lessonDiffs[day][lesson][group] = {};

        lessonDiffs[day][lesson][group][type as keyof TableLesson] = {
          kind,
          newValue: "rhs" in difference ? String(difference.rhs) : undefined,
          oldValue: "lhs" in difference ? String(difference.lhs) : undefined,
        };
        continue;
      default:
        continue;
    }
  }

  return {
    isNewReliable,
    generatedDate: generatedDateDiff,
    validDate: validDateDiff,
    lessons: lessonDiffs,
  };
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
  const url = `${getFuture ? baseUrl.replace(/[^/]+$/, `${NEW_TIMETABLE_PREFIX}`) : baseUrl}/plany/${id}.html`;

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
      };
    }

    const futureData = await getOptivumTimetable(type, index, true);
    const futureDiffs = diff(finalData as OptivumTimetable, futureData);

    if (futureDiffs) {
      return {
        id,
        ...finalData,
        lastUpdated,
        lastModified,
        diffs: processDiffs(futureDiffs, true),
      };
    }

    const isConnected = await isRedisConnected();
    if (!isConnected || !db) {
      return {
        id,
        ...finalData,
        lastUpdated,
        lastModified,
      };
    }

    const old = await db.get(`timetable:${id}`);

    if (!old) {
      await db.set(
        `timetable:${id}`,
        JSON.stringify({
          ...finalData,
          lastModified,
        }),
      );
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
          diffs: processDiffs(oldDiffs, false),
        };
      }
    }

    return {
      id,
      ...finalData,
      lastUpdated,
      lastModified,
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    return {} as OptivumTimetable;
  }
};
