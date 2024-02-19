"use server";

import { convertTextDate } from "@/lib/date";
import { TimeTable, TimeTableData } from "@/types/timetable";
import { Table } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";
import _ from "lodash";

const removeUndefined = (obj: any, value: any) =>
  _.transform(obj, (result: any, val, key) => {
    result[key] = _.isObject(val)
      ? removeUndefined(val, value)
      : _.isUndefined(val)
        ? value
        : val;
  });

interface TimetableResponse {
  timeTable: TimeTable;
  err?: AxiosError;
}

const fetchTimetable = async (
  type: string,
  index: string,
): Promise<TimetableResponse> => {
  if (type == "zastepstwa") {
    return { timeTable: { status: false, data: {} as TimeTableData } };
  }

  const idMap: Record<string, string> = {
    class: `o${index}`,
    teacher: `n${index}`,
    room: `s${index}`,
  };

  const textMap: Record<string, string> = {
    class: "Oddziały",
    teacher: "Nauczyciele",
    room: "Sale",
  };

  const id = idMap[type] || "";
  const text = textMap[type] || "";

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`,
    );
    const timeTableData = new Table(res.data);

    const data = removeUndefined(
      {
        hours: timeTableData?.getHours(),
        lessons: timeTableData?.getDays(),
        generatedDate: timeTableData?.getGeneratedDate(),
        title: timeTableData?.getTitle(),
        validDate: convertTextDate(timeTableData?.getVersionInfo()),
        days: timeTableData?.getDays(),
        dayNames: timeTableData?.getDayNames(),
        text,
        id,
      },
      "",
    );

    return { timeTable: { status: true, data } };
  } catch (err: AxiosError | any) {
    return { timeTable: { status: false, data: {} as TimeTableData }, err };
  }
};

export default fetchTimetable;
