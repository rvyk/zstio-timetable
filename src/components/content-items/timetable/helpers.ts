import { getSubstitution, getSubstitutionForGroup } from "@/lib/substitutions";
import { TableLesson } from "@wulkanowy/timetable-parser";

const getSubstitutionAndSure = (
  dayIndex: number,
  lessonIndex: number,
  branch: string,
  substitutions: SubstitutionTables,
  lesson: TableLesson,
  iterationIndex: number,
  lessonsForDay: TableLesson[],
) => {
  let substitution = getSubstitution(
    dayIndex,
    lessonIndex,
    branch,
    substitutions,
  );
  let sure = true;

  if (substitution && lessonsForDay?.length > 1) {
    substitution = getSubstitutionForGroup(
      dayIndex,
      lessonIndex,
      branch,
      substitutions,
      lesson?.groupName,
    );

    if (!substitution) {
      sure = false;
      lessonsForDay?.forEach((lessonCheck, checkIndex) => {
        if (
          getSubstitutionForGroup(
            dayIndex,
            lessonIndex,
            branch,
            substitutions,
            lessonCheck?.groupName,
          ) &&
          checkIndex !== iterationIndex
        ) {
          substitution = undefined;
          sure = true;
        }
      });
    }
  }

  return { substitution, sure };
};

export const TimeTableSubstitutions = (
  dayIndex: number,
  lessonIndex: number,
  branch: string,
  substitutions: SubstitutionTables,
  lesson: TableLesson,
  iterationIndex: number,
  day: TableLesson[][],
  type: string,
) => {
  if (!substitutions) return { substitution: undefined, sure: true };
  if (type != "Oddziały") return { substitution: undefined, sure: true };

  const { substitution, sure } = getSubstitutionAndSure(
    dayIndex,
    lessonIndex,
    branch,
    substitutions,
    lesson,
    iterationIndex,
    day[lessonIndex],
  );

  return { substitution, possibleSubstitution: substitution, sure };
};

export const MobileTimeTableSubstitutions = (
  dayIndex: number,
  lessonIndex: number,
  branch: string,
  substitutions: SubstitutionTables,
  lesson: TableLesson,
  iterationIndex: number,
  lessonNumber: number,
  lessons: TableLesson[][][],
  type: string,
) => {
  if (!substitutions) return { substitution: undefined, sure: true };
  if (type != "Oddziały") return { substitution: undefined, sure: true };

  const { substitution, sure } = getSubstitutionAndSure(
    dayIndex,
    lessonIndex,
    branch,
    substitutions,
    lesson,
    iterationIndex,
    lessons[dayIndex][lessonNumber - 1],
  );

  return { substitution, possibleSubstitution: substitution, sure };
};
