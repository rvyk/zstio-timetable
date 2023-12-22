import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL);

    const $ = load(response.data);
    const time = $("h2").text().trim();
    const tables: tables[] = [];

    $("table").each((index, table) => {
      const rows = $(table).find("tr");
      const zastepstwa: substitutions[] = [];

      rows.slice(1).each((i, row) => {
        const columns = $(row).find("td");
        const [
          lesson,
          teacher,
          branch,
          subject,
          classValue,
          caseValue,
          message,
        ] = columns.map((index, column) => $(column).text().trim()).get();

        if (lesson) {
          if (req?.query?.search && req?.query?.query) {
            switch (req?.query?.search) {
              case "teacher":
                if (
                  teacher
                    ?.toLowerCase()
                    ?.includes(req?.query?.query?.toString().toLowerCase())
                ) {
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
                break;
              case "branch":
                if (
                  branch
                    ?.toLowerCase()
                    ?.includes(req?.query?.query?.toString().toLowerCase())
                ) {
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
                break;
              default:
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
          } else {
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
        }
      });

      tables.push({
        time: rows.first().text().trim(),
        zastepstwa: zastepstwa,
      });
    });

    res.status(200).json({ time, tables });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", time: {}, tables: {} });
  }
}
