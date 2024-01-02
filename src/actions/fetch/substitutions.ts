import axios from "axios";
import { load } from "cheerio";

const fetchSubstitutions = async (): Promise<Substitutions> => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string,
    );
    const $ = load(response.data);
    const timeRange = $("h2").text().trim();
    const tables: SubstitutionTables[] = [];

    $("table").each((_index, table) => {
      const rows = $(table).find("tr");
      const tableDate = rows.first().text().trim();
      const zastepstwa: Substitution[] = [];

      rows.slice(1).each((_i, row) => {
        const columns = $(row).find("td");
        const [
          lesson,
          teacher,
          branch,
          subject,
          classValue,
          caseValue,
          message,
        ] = columns.map((_index, column) => $(column).text().trim()).get();

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
      status: true,
      timeRange,
      tables,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      timeRange: "",
      tables: [],
    };
  }
};

export default fetchSubstitutions;
