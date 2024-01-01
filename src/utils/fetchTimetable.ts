import { Table } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";

const fetchTimetable = async (
  id: string,
): Promise<{ data: Table; ok: boolean; err: AxiosError }> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`,
    );
    const timeTableData = new Table(res.data);
    return { data: timeTableData, ok: true, err: undefined };
  } catch (err) {
    return { data: undefined, ok: false, err };
  }
};

export default fetchTimetable;
