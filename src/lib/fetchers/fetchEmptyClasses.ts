import fetchAllClasses from "@/lib/fetchers/fetchAllClasses";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import { cases } from "@/lib/utils";
import { EmptyAPI } from "@/types/api";

export async function fetchEmptyClasses(dayIndex: number, lessonIndex: number) {
  try {
    if (isNaN(dayIndex) || isNaN(lessonIndex)) {
      return {
        success: false,
        msg: `Specify dayIndex and lessonIndex to continue`,
      };
    }

    const data: any = await fetchAllClasses();

    const responseObj: EmptyAPI = { success: true, classes: [] };

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
      success: false,
      msg: "An error occurred",
    };
  }
}
