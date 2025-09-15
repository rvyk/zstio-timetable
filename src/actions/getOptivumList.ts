"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { env } from "@/env";
import { List, TimetableList } from "@majusss/timetable-parser";

export const getOptivumList = async (): Promise<List> => {
  const baseUrl =
    env.NEXT_PUBLIC_TIMETABLE_URL.replace(/\/+$/, "");
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
