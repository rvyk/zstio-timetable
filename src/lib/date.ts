/**
 * ZSTiO Elektronika returns the "valid" date in "16 października, 2023r." or "16.10.2023r" format and the "Generated" date in "yyyy-mm-dd" format, so we should convert them to one format.
 */

const months: Record<string, string> = {
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

export const convertTextDate = (inputDate: string): string => {
  const regexes = [
    /(\d{1,2}\.?) (\w+) (\d{4})/,
    /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
  ];
  if (regexes[0].test(inputDate)) {
    const matchResult = inputDate.match(regexes[0]);
    if (matchResult) {
      const [, day, month, year] = matchResult;
      return `${year}-${
        months[month.toLowerCase().padStart(2, "0")]
      }-${day.padStart(2, "0").replace(".", "")}`;
    }
  } else if (regexes[1].test(inputDate)) {
    const matchResult = inputDate.match(regexes[1]);
    if (matchResult) {
      const [, day, month, year] = matchResult;
      return `${year}-${month}-${day}`;
    }
  }
  // const dateParts = inputDate.split(" ");
  // if(dateParts.length === 3 && dateParts[1].length > 2) {}
  return inputDate;
};
