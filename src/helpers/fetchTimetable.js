const fetchTimetable = async (id) => {
  let timeTableData = "";
  let timeTableOk = false;
  try {
    await fetch(`${process.env.API_URL}/api/timetable?id=${id}`)
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

export default fetchTimetable;
