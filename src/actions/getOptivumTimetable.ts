"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { parseHeaderDate } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { Table } from "@majusss/timetable-parser";
import moment from "moment";
import "moment/locale/pl";
import parser from "any-date-parser";
import { getOptivumList } from "./getOptivumList";
import { env } from "@/env";

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
      env.NEXT_PUBLIC_TIMETABLE_URL.replace(/\/+$/, "");
    const url = `${baseUrl}/plany/${id}.html`;

    const res = await fetch(url, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });

    const data = await res.text();
    const timeTableData = new Table(data);

    const generatedRaw = timeTableData.getGeneratedDate() ?? "";
    const generatedParsed = parser.fromString(generatedRaw, "pl");
    const generatedDate = generatedParsed.isValid()
      ? moment(generatedParsed)
          .locale("pl")
          .format("D MMMM YYYY[r.]")
      : null;

    const validRaw = timeTableData.getVersionInfo();
    const validParsed = parser.fromString(validRaw, "pl");
    const validDate = validParsed.isValid()
      ? moment(validParsed).locale("pl").format("D MMMM YYYY[r.]")
      : null;

    return {
      id,
      hours: timeTableData.getHours(),
      lessons: timeTableData.getDays(),
      generatedDate,
      title: timeTableData.getTitle(),
      type: type as OptivumTimetable["type"],
      validDate,
      dayNames: timeTableData.getDayNames(),
      list: await getOptivumList(),
      lastUpdated: parseHeaderDate(res),
    };
  } catch (error) {
    console.error("Failed to fetch Optivum timetable:", error);
    return {} as OptivumTimetable;
  }
};
