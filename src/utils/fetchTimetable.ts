import axios, { AxiosError } from "axios";

const fetchTimetable = async (
  id: string
): Promise<{ data: string; ok: boolean; err: AxiosError }> => {
  let timeTableData: string;
  let timeTableOk = false;
  let err: AxiosError;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/proxy/getTimetable/${id}.html`
    );
    timeTableOk = true;
    timeTableData = res.data;
  } catch (e) {
    err = e;
  }
  return { data: timeTableData, ok: timeTableOk, err };
};

export default fetchTimetable;
