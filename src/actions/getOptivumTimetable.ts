"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { parseHeaderDate } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { Table } from "@majusss/timetable-parser";
import moment from "moment";
import "moment/locale/pl";
import { getOptivumList } from "./getOptivumList";

export const getOptivumTimetable = async (
  type: string,
  index: string,
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
    const url = `${baseUrl}/plany/${id}.html`;

    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });

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
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    return {} as OptivumTimetable;
  }
};
