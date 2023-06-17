const fetchTimetableList = async () => {
  let timeTableData = "";
  let timeTableOk = false;
  await fetch(
    `https://cors-anywhere.herokuapp.com/http://www.zstio-elektronika.pl/plan/lista.html`,
    {
      mode: "cors",
    }
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

export default fetchTimetableList;
