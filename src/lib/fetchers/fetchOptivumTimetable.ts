"use server";

import fetchOptivumList from "@/lib/fetchers/fetchOptivumList";
import { OptivumTimetable } from "@/types/timetable";
import { Table } from "@wulkanowy/timetable-parser";
import fetchSubstitutions from "./fetchSubstitutions";

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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`,
  );
  const data = await res.text();

  const timeTableData = new Table(data);

  return {
    id,
    hours: timeTableData.getHours(),
    lessons: timeTableData.getDays(),
    generatedDate: timeTableData.getGeneratedDate(),
    title: timeTableData.getTitle(),
    type:
      { class: "Oddziały", teacher: "Nauczyciele", room: "Klasy" }[type] ||
      "Brak danych",
    validDate: timeTableData.getVersionInfo(), //TODO: convert data format
    days: timeTableData.getDays(),
    dayNames: timeTableData.getDayNames(),
    list: await fetchOptivumList(),
    substitutions: await fetchSubstitutions(),
  };
};

export default fetchOptivumTimetable;
