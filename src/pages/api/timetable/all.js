import fetchTimetableList from "@/utils/fetchTimetableList";
import { TimetableList } from "@wulkanowy/timetable-parser";
import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

export default async function handler(req, res) {
  try {
    const target = req.query?.target || "all";

    const cachedData = cache.get(target);
    if (cachedData) {
      return res.status(200).send(cachedData);
    }

    const { data, ok, err } = await fetchTimetableList();
    if (!ok) {
      return res.status(500).send({
        success: false,
        msg: `Timetable returned status other than 200 (${err.response.status})`,
      });
    }

    const tableList = new TimetableList(data);
    const { classes, teachers, rooms } = tableList.getList();

    const responseObj = { success: true, classes: [], teachers: [] };

    if (target === "classes" || target === "all")
      for (const { value } of classes) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/api/timetable/getTimetable?id=s${value}`,
        );
        responseObj.classes.push({
          title: res.data.title,
          id: value,
          lessons: res.data.lessons,
        });
      }

    if (target === "teachers" || target === "all")
      for (const { value } of teachers) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/api/timetable/getTimetable?id=n${value}`,
        );
        responseObj.teachers.push({
          title: res.data.title,
          id: value,
          lessons: res.data.lessons,
        });
      }

    cache.set(target, responseObj);

    res.status(200).send(responseObj);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      msg: "An error occurred",
      err: error.message,
    });
  }
}
