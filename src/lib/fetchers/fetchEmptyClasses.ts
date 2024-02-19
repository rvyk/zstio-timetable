"use server";

import fetchAllClasses from "@/lib/fetchers/fetchAllClasses";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import { cases } from "@/lib/utils";
import { Empty } from "@/types/api";

const fetchEmptyClasses = async (
  dayIndex: number,
  lessonIndex: number,
): Promise<Empty> => {
  try {
    if (isNaN(dayIndex) || isNaN(lessonIndex)) {
      return {
        classes: [],
      };
    }

    const data: any = await fetchAllClasses();

    const responseObj: Empty = { classes: [] };

    for (const classObj of data.classes) {
      if (!classObj.lessons[dayIndex][lessonIndex]?.length) {
        responseObj.classes.push({
          name: classObj.title,
          value: classObj.id,
        });
      }
    }

    if (process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL) {
      const substitutions = (await fetchSubstitutions()).tables[0];
      if (substitutions?.dayIndex === dayIndex) {
        substitutions.zastepstwa.forEach((sub) => {
          if (
            sub.class &&
            cases.includes(sub.case) &&
            +sub.lesson.split(",")[0] === lessonIndex + 1
          ) {
            responseObj.classes.push({
              name: `Z zastępstw: ${sub.class}`,
              url: `/zastepstwa?teachers=${sub?.teacher.replaceAll(
                " ",
                "+",
              )}&branches=${sub?.branch}`,
            });
          }
        });
      }
    }
    return responseObj;
  } catch (error) {
    console.log(error);
    return {
      classes: [],
    };
  }
};

export default fetchEmptyClasses;
