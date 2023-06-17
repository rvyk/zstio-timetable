const fetchTimetable = async (id) => {
  let timeTableData = "";
  let timeTableOk = false;
  await fetch(
    `https://www.zstio-elektronika.pl/plan/plany/o${id}.html
`
  )
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
