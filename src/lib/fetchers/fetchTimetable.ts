import { convertTextDate } from "@/lib/date";
import { TimeTableData } from "@/types/timetable";
import { Table } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";
import _ from "lodash";
import { GetStaticPropsContext } from "next";

const removeUndefined = (obj: any, value: any) =>
  _.transform(obj, (result: any, val, key) => {
    result[key] = _.isObject(val)
      ? removeUndefined(val, value)
      : _.isUndefined(val)
        ? value
        : val;
  });

const fetchTimetable = async (
  context: GetStaticPropsContext,
): Promise<{ ok: boolean; data?: TimeTableData; err?: AxiosError }> => {
  const { params } = context;

  const param0 = params?.all?.[0] ?? "";
  const param1 = params?.all?.[1] ?? "";

  if (param0 == "zastepstwa") {
    return { ok: true };
  }

  const idMap: Record<string, string> = {
    class: `o${param1}`,
    teacher: `n${param1}`,
    room: `s${param1}`,
  };

  const textMap: Record<string, string> = {
    class: "Oddziały",
    teacher: "Nauczyciele",
    room: "Sale",
  };

  const id = idMap[param0] || "";
  const text = textMap[param0] || "";

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

    return { data, ok: true };
  } catch (err: AxiosError | any) {
    return { ok: false, err };
  }
};

export default fetchTimetable;
