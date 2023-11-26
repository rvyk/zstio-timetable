const months = {
  stycznia: "01",
  lutego: "02",
  marca: "03",
  kwietnia: "04",
  maja: "05",
  czerwca: "06",
  lipca: "07",
  sierpnia: "08",
  września: "09",
  października: "10",
  listopada: "11",
  grudnia: "12",
};

function formatDate(inputDate) {
  const regexes = [/(\d{1,2}) (\w+) (\d{4})/, /(\d{2})\.(\d{2})\.(\d{4})/];
  if (regexes[0].test(inputDate)) {
    const [, day, month, year] = inputDate.match(regexes[0]);
    return `${year}-${months[month.toLowerCase()]}-${day}`;
  } else if (regexes[1].test(inputDate)) {
    const [, day, month, year] = inputDate.match(regexes[1]);
    return `${year}-${month}-${day}`;
  } else {
    return inputDate;
  }
}

console.log(formatDate("22 stycznia 2022"));
console.log(formatDate("30 czerwca 2023"));
console.log(formatDate("05.04.2021"));
console.log(formatDate("05-04-2021r."));
