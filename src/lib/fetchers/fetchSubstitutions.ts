"use server";

import { load } from "cheerio";
import {
  getLastSubstitutionDate,
  setLastSubstitutionDate,
} from "../getLastDates";
import { sendNotification } from "../notifications";

const fetchSubstitutions = async (): Promise<SubstitutionsPage> => {
  if (!process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL)
    throw new Error("No substitutions URL provided");
  const response = await fetch(process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL);
  const $ = load(await response.text());
  const timeRange = $("h2").text().trim();
  if ((await getLastSubstitutionDate()) != timeRange) {
    sendNotification({
      title: "Aktualizacja zastepstw",
      options: {
        body: `Nowe zastepstwa: "${timeRange}" dostępne na planie lekcji!`,
        tag: timeRange,
      },
    });
    setLastSubstitutionDate(timeRange);
  }
  const heading = $("h1").text().trim();
  const tables: SubstitutionTable[] = [];

  $("table").each((_index, table) => {
    const rows = $(table).find("tr");
    const tableDate = rows.first().text().trim();
    const zastepstwa: Substitution[] = [];

    rows.slice(1).each((_i, row) => {
      const columns = $(row).find("td");
      const [lesson, teacher, branch, subject, classValue, caseValue, message] =
        columns.map((_index, column) => $(column).text().trim()).get();

      if (lesson) {
        zastepstwa.push({
          lesson,
          teacher,
          branch,
          subject,
          class: classValue,
          case: caseValue,
          message,
        });
      }
    });

    const shortDayNames = ["pon", "wt", "śr", "czw", "pt", "sob", "nie"];
    const match = tableDate.match(/\([^)]*\)/i);
    const dayIndex = match
      ? shortDayNames.indexOf(match[0]?.substring(1)?.replace(".)", ""))
      : -1;

    tables.push({
      time: tableDate,
      dayIndex,
      zastepstwa,
    });
  });

  return {
    heading,
    timeRange,
    tables,
  };
};

export default fetchSubstitutions;
