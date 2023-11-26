export const removeUndefined = (obj) => {
  const cleanedObj = {};

  try {
    if (typeof obj !== "object" || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(removeUndefined).filter((item) => item !== undefined);
    }

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = removeUndefined(value);
      if (cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    });
  } catch (e) {
    return null;
  }
  return cleanedObj;
};

// ZSTiO Elektronika returns the "valid" date in "16 października, 2023r." or "16.10.2023r" format and the "Generated" date in "yyyy-mm-dd" format, so we should convert them to one format.
type Months = {
  [key: string]: string;
};

const months: Months = {
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

export function convertTextDate(inputDate: string): string {
  const regexes = [/(\d{1,2}) (\w+) (\d{4})/, /(\d{1,2})\.(\d{1,2})\.(\d{4})/];
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

export const cases = [
  "Uczniowie przychodzą później",
  "Przeniesiona",
  "Okienko dla uczniów",
  "Uczniowie zwolnieni do domu",
];

export const days = [
  { long: "Poniedziałek", short: "Pon.", index: 0 },
  { long: "Wtorek", short: "Wt.", index: 1 },
  { long: "Środa", short: "Śr.", index: 2 },
  { long: "Czwartek", short: "Czw.", index: 3 },
  { long: "Piątek", short: "Pt.", index: 4 },
];
