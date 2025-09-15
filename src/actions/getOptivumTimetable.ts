"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { joinDataSourcePath } from "@/lib/dataSource";
import { parseHeaderDate } from "@/lib/utils";
import type { OptivumTimetable } from "@/types/optivum";
import type { List } from "@majusss/timetable-parser";
import { Table } from "@majusss/timetable-parser";
import parser from "any-date-parser";
import moment from "moment";
import "moment/locale/pl";
import { getActiveDataSource } from "./getActiveDataSource";
import { getOptivumList } from "./getOptivumList";

export const getOptivumTimetable = async (
  type: OptivumTimetable["type"],
  index: string,
  dataSource?: string,
): Promise<OptivumTimetable> => {
  const timetablePrefixes: Record<OptivumTimetable["type"], string> = {
    class: "o",
    teacher: "n",
    room: "s",
  };

  const sanitizedIndex = index.trim();
  const timetableId = sanitizedIndex
    ? `${timetablePrefixes[type]}${sanitizedIndex}`
    : "";

  const fallbackTimetable = (
    list: List,
  ): OptivumTimetable => ({
    id: timetableId,
    hours: {},
    lessons: [],
    generatedDate: null,
    title: "",
    type,
    validDate: null,
    dayNames: [],
    list,
    lastUpdated: "Brak danych",
  });

  const formatOptivumDate = (raw?: string | null): string | null => {
    if (!raw) {
      return null;
    }

    const parsedDate = parser.fromString(raw, "pl");
    if (!parsedDate.isValid()) {
      return null;
    }

    return moment(parsedDate).locale("pl").format("D MMMM YYYY[r.]");
  };

  const listPromise = getOptivumList(dataSource);

  if (!sanitizedIndex) {
    const list = await listPromise;
    return fallbackTimetable(list);
  }

  try {
    const baseUrl = await getActiveDataSource(dataSource);
    if (!baseUrl) {
      const list = await listPromise;
      return fallbackTimetable(list);
    }

    const url = joinDataSourcePath(baseUrl, `plany/${timetableId}.html`);
    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Błąd pobierania planu (${response.status} ${response.statusText})`,
      );
    }

    const data = await response.text();
    const timeTableData = new Table(data);
    const list = await listPromise;

    return {
      id: timetableId,
      hours: timeTableData.getHours(),
      lessons: timeTableData.getDays(),
      generatedDate: formatOptivumDate(timeTableData.getGeneratedDate()),
      title: timeTableData.getTitle(),
      type,
      validDate: formatOptivumDate(timeTableData.getVersionInfo()),
      dayNames: timeTableData.getDayNames(),
      list,
      lastUpdated: parseHeaderDate(response),
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    const list = await listPromise;
    return fallbackTimetable(list);
  }
};
