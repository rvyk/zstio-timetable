export const getSubstitution = (
  dayIndex: number,
  lessonIndex: number,
  className: string,
  substitutions: SubstitutionTable,
) => {
  if (dayIndex === substitutions.dayIndex) {
    const matchingSubstitution = substitutions.zastepstwa?.find((subs) => {
      const lessonNumber = parseInt(subs.lesson?.split(",")[0]) - 1;
      const hasMatchingBranch = className.includes(" ")
        ? className.split(" ").some((branch) => subs.branch?.includes(branch))
        : subs.branch?.includes(className);

      return lessonNumber === lessonIndex && hasMatchingBranch;
    });

    return matchingSubstitution;
  }
};

export const getSubstitutionForGroup = (
  dayIndex: number,
  lessonIndex: number,
  className: string,
  substitutions: SubstitutionTable,
  groupName?: string,
) => {
  if (dayIndex === substitutions.dayIndex) {
    const matchingSubstitution = substitutions.zastepstwa?.find((subs) => {
      const lessonNumber = parseInt(subs.lesson?.split(",")[0]) - 1;
      const hasMatchingBranch = className.includes(" ")
        ? className.split(" ").some((branch) => subs.branch?.includes(branch))
        : subs.branch?.includes(className);
      const hasMatchingGroupName = subs.branch?.split("|")[1] === groupName;

      return (
        lessonNumber === lessonIndex &&
        hasMatchingBranch &&
        hasMatchingGroupName
      );
    });

    return matchingSubstitution;
  }
};
