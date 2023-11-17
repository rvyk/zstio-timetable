import axios from "axios";

const fetchTimetableList = async (): Promise<{
  data: string | undefined;
  ok: boolean;
  err: any;
}> => {
  let timeTableData: string;
  let timeTableOk = false;
  let err;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/proxy/getTimetableList`,
    );
    timeTableOk = res.status == 200;
    timeTableData = res.data;
  } catch (e) {
    err = e;
  }
  return { data: timeTableData, ok: timeTableOk, err };
};

export default fetchTimetableList;
