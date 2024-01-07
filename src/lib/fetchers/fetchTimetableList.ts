import { List, TimetableList } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";

interface TimetableListResponse {
  ok: boolean;
  data?: List | null;
  err?: AxiosError | null;
}

const fetchTimetableList = async (): Promise<TimetableListResponse> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`,
    );

    if (res.data) {
      const timeTableList = new TimetableList(res.data).getList();

      return { data: timeTableList, ok: true };
    }
  } catch (err: AxiosError | any) {
    return { ok: false, err };
  }

  return { ok: false };
};

export default fetchTimetableList;
