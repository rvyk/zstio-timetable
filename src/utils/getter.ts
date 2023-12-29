import axios, { AxiosResponse } from "axios";
import { load } from "cheerio";

export const getTeacher = async (title) => {
  if (title?.match(/\b(\p{L}+)\s/u)?.length) {
    return title
      ?.match(/\b(\p{L}+)\s/u)[0]
      ?.toString()
      ?.trim();
  }
  const teachers = await axios.get("/teachers.json");
  if (typeof teachers?.data != "object") {
    return undefined;
  }
  const result = teachers.data?.filter((teacher) => teacher.name === title);
  if (result?.length === 1) return result[0].full.split(" ")[0];
};

/**
 * Only for server side (api)
 */
export async function getSubstitutionsObject(): Promise<substitutions> {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL);
    const $ = load(response.data);
    const timeRange = $("h2").text().trim();
    const tables: substitutionTableType[] = [];

    $("table").each((_index, table) => {
      const rows = $(table).find("tr");
      const tableDate = rows.first().text().trim();
      const zastepstwa: substitutionType[] = [];

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
}

export const getSubstitution = (
  dayIndex: number,
  lessonIndex: number,
  substitutions: substitutionTableType
) => {
  if (dayIndex === substitutions?.dayIndex)
    return substitutions?.zastepstwa?.filter((subs) => {
      return parseInt(subs.lesson?.split(",")[0]) - 1 === lessonIndex;
    })[0];
};

export const getSubstitutionForGroup = (
  groupName: string,
  substitutions: substitutionTableType,
  lessonIndex: number,
  dayIndex: number
) => {
  if (dayIndex === substitutions?.dayIndex)
    return substitutions?.zastepstwa?.filter((subs) => {
      if (
        parseInt(subs.lesson?.split(",")[0]) - 1 === lessonIndex &&
        subs?.branch?.includes("|") &&
        subs?.branch?.split("|")[1] === groupName
      ) {
        return subs;
      }
    })[0];
};
