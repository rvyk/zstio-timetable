const fetchTimetable = async (id) => {
  let timeTableData = "";
  let timeTableOk = false;
  await fetch(`http://localhost:3000/api/timetable?id=${id}`)
    .then((response) => {
      timeTableOk = response.ok;
      return response.text();
    })
    .then((data) => {
      timeTableData = data;
    });
  return { data: timeTableData, ok: timeTableOk };
};

export default fetchTimetable;
