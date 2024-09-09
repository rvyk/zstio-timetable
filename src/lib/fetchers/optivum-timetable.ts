"use server";

import { OptivumTimetable } from "@/types/optivum";
import { Table } from "@majusss/timetable-parser";
import moment from "moment";
import "moment/locale/pl";
import fetchOptivumList from "./optivum-list";

const fetchOptivumTimetable = async (
  type: string,
  index: string,
): Promise<OptivumTimetable> => {
  const idMap: Record<string, string> = {
    class: `o${index}`,
    teacher: `n${index}`,
    room: `s${index}`,
  };
  const id = idMap[type] || "";

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`,
  ).then((res) => res.text());

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
    list: await fetchOptivumList(),
  };
};

export default fetchOptivumTimetable;
