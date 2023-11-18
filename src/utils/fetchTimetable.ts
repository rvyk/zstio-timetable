import axios, { AxiosError } from "axios";
import { Table } from "@wulkanowy/timetable-parser";

const fetchTimetable = async (
  id: string,
): Promise<{ data: Table; ok: boolean; err: AxiosError }> => {
  let timeTableData: Table;
  let timeTableOk = false;
  let err: AxiosError;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/proxy/getTimetable/${id}.html`,
    );
    if (res.data) {
      timeTableData = new Table(res.data);
      timeTableOk = true;
    }
  } catch (e) {
    err = e;
  }
  return { data: timeTableData, ok: timeTableOk, err };
};

export default fetchTimetable;
