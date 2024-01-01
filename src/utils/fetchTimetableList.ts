import { List, TimetableList } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";

const fetchTimetableList = async (): Promise<{
  data: List | null;
  ok: boolean;
  err: AxiosError | null;
}> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`,
    );

    if (res.data) {
      const timeTableList = new TimetableList(res.data).getList();
      return { data: timeTableList, ok: true, err: null };
    }
  } catch (err) {
    return { data: null, ok: false, err };
  }

  return { data: null, ok: false, err: null };
};

export default fetchTimetableList;
