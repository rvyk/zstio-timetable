const fetchTimetableList = async () => {
  let timeTableData = "";
  let timeTableOk = false;
  try {
    await fetch(`${process.env.API_URL}/api/timetablelist`)
      .then((response) => {
        timeTableOk = response.ok;
        return response.text();
      })
      .then((data) => {
        timeTableData = data;
      });
  } catch (e) {
    timeTableData = {};
  }
  return { data: timeTableData, ok: timeTableOk };
};

export default fetchTimetableList;
