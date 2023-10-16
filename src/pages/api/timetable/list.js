import { TimetableList } from "@wulkanowy/timetable-parser";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

export default async function handler(req, res) {
  try {
    const cacheKey = req.query.select || "default";

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).send(cachedData);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`
    );
    const data = await response.text();
    const tableList = new TimetableList(data);
    const { classes, teachers, rooms } = tableList.getList();

    if (response.status !== 200) {
      return res.status(500).send({
        success: false,
        msg: "ZSTiO Elektronika returned status other than 200",
      });
    }

    let responseObj = { success: true };
    switch (req.query.select) {
      case "classes":
        responseObj.classes = classes;
        break;
      case "teachers":
        responseObj.teachers = teachers;
        break;
      case "rooms":
        responseObj.rooms = rooms;
        break;
      default:
        responseObj.classes = classes;
        responseObj.teachers = teachers;
        responseObj.rooms = rooms;
        break;
    }

    cache.set(cacheKey, responseObj);

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
