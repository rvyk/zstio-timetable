import axios from "axios";

const fetchTimetableList = async () => {
  let timeTableData;
  let timeTableOk = false;
  let err;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/proxy/getTimetableList`
    );
    timeTableOk = res.status = 200 ? true : false;
    timeTableData = res.data;
  } catch (e) {
    timeTableData = {};
    err = e;
  }
  return { data: timeTableData, ok: timeTableOk, err };
};

export default fetchTimetableList;
