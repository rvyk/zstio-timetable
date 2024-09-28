"use server";

import { parseHeaderDate } from "@/lib/utils";
import Substitutions from "@majusss/substitutions-parser/dist/substitutions";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { fetchOptivumList } from "./optivum-list";

const findRelations = async (
  page: SubstitutionsPage,
): Promise<SubstitutionsPage> => {
  const list = await fetchOptivumList();
  const newTables = page.tables.map((table) => {
    const newSubstitutions = table.substitutions.map((substitution) => {
      const newLessonSubstitute = substitution.lessonSubstitute?.map(
        (lesson) => {
          const teacherId = list.teachers?.find((teacher) =>
            teacher.name.includes(lesson.teacher ?? ""),
          )?.value;

          const roomId = list.rooms?.find((room) =>
            room.name.includes(lesson.room),
          )?.value;

          return {
            ...lesson,
            teacherId,
            roomId,
          };
        },
      );

      return {
        ...substitution,
        lessonSubstitute: newLessonSubstitute,
      };
    });

    return { ...table, substitutions: newSubstitutions };
  });

  return { ...page, tables: newTables };
};

export const fetchSubstitutions = async (): Promise<SubstitutionsPage> => {
  const url = process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 900,
      },
    });
    const html = await res.text();

    return {
      ...(await findRelations(new Substitutions(html).parseSubstitutionSite())),
      lastUpdated: parseHeaderDate(res),
    };
  } catch (error) {
    return { heading: "", tables: [], timeRange: "", lastUpdated: "" };
  }
};
