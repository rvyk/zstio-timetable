import fetchTimetableList from "@/utils/fetchTimetableList";
import { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 5400 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cacheKey: string = req.query.select[0] || "default";

    const cachedData = cache.get(cacheKey);
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

    const { classes, teachers, rooms } = data;

    let responseObj = { success: true, classes, teachers, rooms };
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
