"use server";

import { List, TimetableList } from "@majusss/timetable-parser";

export const fetchOptivumList = async (): Promise<List> => {
  const url = `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`;

  try {
    const response = await fetch(url);
    const data = await response.text();

    return new TimetableList(data).getList();
  } catch (error) {
    console.error("Failed to fetch Optivum list:", error);
    return { classes: [], rooms: [], teachers: [] };
  }
};
