export const getSubstitution = (
  dayIndex: number,
  lessonIndex: number,
  className: string,
  substitutions: SubstitutionTables,
) => {
  if (dayIndex === substitutions?.dayIndex) {
    return substitutions?.zastepstwa?.filter((subs) => {
      return (
        parseInt(subs.lesson?.split(",")[0]) - 1 === lessonIndex &&
        (className.includes(" ")
          ? subs?.branch?.includes(className.split(" ")[0]) ||
            subs?.branch?.includes(className.split(" ")[1])
          : subs?.branch?.includes(className))
      );
    })[0];
  }
};

export const getSubstitutionForGroup = (
  dayIndex: number,
  lessonIndex: number,
  className: string,
  substitutions: SubstitutionTables,
  groupName?: string,
) => {
  if (dayIndex === substitutions?.dayIndex)
    return substitutions?.zastepstwa?.filter((subs) => {
      if (
        parseInt(subs.lesson?.split(",")[0]) - 1 === lessonIndex &&
        (className.includes(" ")
          ? subs?.branch?.includes(className.split(" ")[0]) ||
            subs?.branch?.includes(className.split(" ")[1])
          : subs?.branch?.includes(className)) &&
        subs?.branch?.includes("|") &&
        subs?.branch?.split("|")[1] === groupName
      ) {
        return subs;
      }
    })[0];
};
