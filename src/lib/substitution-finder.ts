import { Substitution } from "@majusss/substitutions-parser";
import { SubstitutionTable } from "@majusss/substitutions-parser/dist/types";

export const findSubstitution = (
  tables: SubstitutionTable[],
  weekdayIndex: number,
  className: string,
  lessonIndex: number,
  groupName: string | undefined,
): Substitution | null => {
  const todayTable = tables.find((table) => table.weekday == weekdayIndex);
  if (!todayTable) return null;

  const substitution =
    todayTable.substitutions.find((substitution) => {
      if (groupName) {
        if (substitution.class.includes("|")) {
          const classArray = substitution.class.split("|");
          return (
            classArray[0] == className &&
            substitution.number == lessonIndex + 1 &&
            classArray[1] == groupName
          );
        } else {
          return (
            substitution.class.includes(className) &&
            substitution.number == lessonIndex + 1
          );
        }
      } else {
        return (
          substitution.class.includes(className) &&
          substitution.number == lessonIndex + 1
        );
      }
    }) ?? null;

  return substitution;
};
