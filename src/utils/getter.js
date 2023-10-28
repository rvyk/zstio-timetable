import axios from "axios";

export const getTeacher = async (title) => {
  const teachers = await axios.get("/teachers.json");
  if (typeof teachers?.data != "object") {
    return undefined;
  }
  const result = teachers.data?.filter((teacher) => teacher.name === title);
  if (result?.length === 1) return result[0].full.split(" ")[0];
};

export async function getSubstitutions(text, title) {
  const search =
    text === "Oddziały"
      ? "branch"
      : text === "Nauczyciele"
      ? "teacher"
      : undefined;
  const query =
    search === "teacher"
      ? await getTeacher(title)
      : title.includes(" ")
      ? title.split(" ")[0]
      : title;

  if (search && query) {
    try {
      const substitutionsRes = await axios.get(
        `/api/getSubstitutions?search=${search}&query=${query}`
      );
      const shortDayNames = ["pon", "wt", "śr", "czw", "pt", "sob", "nie"];
      const match = substitutionsRes.data?.tables[0]?.time.match(/\([^)]*\)/i);

      if (match && match.length > 0) {
        const dayIndex = shortDayNames.indexOf(
          match[0].substring(1).replace(".)", "")
        );
        if (dayIndex >= 0) {
          return {
            dayIndex,
            zastepstwa: substitutionsRes.data.tables[0].zastepstwa,
          };
        }
      } else {
        return {};
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  }
}

export const getSubstitution = (dayIndex, lessonIndex, substitutions) => {
  if (dayIndex === substitutions.dayIndex)
    return substitutions?.zastepstwa?.filter((subs) => {
      return subs.lesson.split(",")[0] - 1 === lessonIndex;
    })[0];
};

export const getSubstitutionForGroup = (
  groupName,
  substitutions,
  lessonIndex,
  dayIndex
) => {
  if (dayIndex === substitutions?.dayIndex)
    return substitutions?.zastepstwa?.filter((subs) => {
      if (
        subs.lesson.split(",")[0] - 1 === lessonIndex &&
        subs.branch.includes(groupName)
      ) {
        return subs;
      }
    })[0];
};
