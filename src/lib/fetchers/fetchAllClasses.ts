import fetchTimetable from "@/lib/fetchers/fetchTimetable";
import fetchTimetableList from "@/lib/fetchers/fetchTimetableList";
import { AllClasses } from "@/types/api";
import { List } from "@wulkanowy/timetable-parser";

const fetchAllClasses = async (): Promise<AllClasses> => {
  try {
    const { data, ok, err } = await fetchTimetableList();
    if (!ok) {
      return {
        success: false,
        msg: `Timetable returned status other than 200 (${err?.response?.status})`,
        classes: [],
      };
    }

    const { classes } = data as List;

    const responseObj: AllClasses = { success: true, classes: [] };

    for (const { value } of classes) {
      const context = { params: { all: ["room", value] } };
      const {
        timeTable: { data },
      } = await fetchTimetable(context);

      responseObj.classes.push({
        title: data.title ?? "",
        id: value,
        lessons: data.lessons ?? [],
      });
    }

    return responseObj;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "An error occurred",
      classes: [],
    };
  }
};

export default fetchAllClasses;
