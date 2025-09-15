"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { List, TimetableList } from "@majusss/timetable-parser";
import { getActiveDataSource } from "./getActiveDataSource";

export const getOptivumList = async (
  dataSource: string = "default",
): Promise<List> => {
  const baseUrl = (await getActiveDataSource(dataSource)).replace(/\/+$/, "");
  const url = `${baseUrl}/lista.html`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });
    const data = await response.text();

    return new TimetableList(data).getList();
  } catch (error) {
    console.error("Failed to fetch Optivum list:", error);
    return { classes: [] };
  }
};
