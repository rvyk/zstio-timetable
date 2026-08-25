"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { getTimetableBaseUrl, joinDataSourcePath } from "@/lib/dataSource";
import type { List } from "@majusss/timetable-parser";
import { TimetableList } from "@majusss/timetable-parser";

const EMPTY_LIST: List = { classes: [], teachers: [], rooms: [] };

export const getOptivumList = async (): Promise<List> => {
  try {
    const baseUrl = getTimetableBaseUrl();
    if (!baseUrl) {
      return { ...EMPTY_LIST };
    }

    const url = joinDataSourcePath(baseUrl, "lista.html");
    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Błąd pobierania listy planów (${response.status} ${response.statusText})`,
      );
    }
    const data = await response.text();

    return new TimetableList(data).getList();
  } catch (error) {
    console.error("Failed to fetch Optivum list:", error);
    return { ...EMPTY_LIST };
  }
};
