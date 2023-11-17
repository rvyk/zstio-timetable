import { List, TimetableList } from "@wulkanowy/timetable-parser";
import axios, { AxiosError } from "axios";

const fetchTimetableList = async (): Promise<{
  data: List;
  ok: boolean;
  err: AxiosError;
}> => {
  let timeTableList: List;
  let timeTableOk = false;
  let err: AxiosError;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/proxy/getTimetableList`
    );

    timeTableList = new TimetableList(await res.data).getList();

    timeTableOk = true;
  } catch (e) {
    err = e;
  }

  return { data: timeTableList, ok: timeTableOk, err };
};

export default fetchTimetableList;
