import fetchTimetable from "@/utils/fetchTimetable";
import { Table } from "@wulkanowy/timetable-parser";
import NodeCache from "node-cache";
import { NextApiRequest, NextApiResponse } from "next";
import { timetableApiType } from "@/types/api";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    let id = req?.query?.id?.toString();

    if (!id) {
      id = "o1";
    }

    const cachedData: timetableApiType = cache.get(id);
    if (cachedData) {
      return res.status(200).send(cachedData);
    }

    const { data: timetableList, ok, err } = await fetchTimetable(id);

    if (!ok) {
      switch (err.response.status) {
        case 404:
          return res.status(404).send({
            success: false,
            msg: `No data found with id (${id})`,
          });
        default:
          return res.status(500).send({
            success: false,
            msg: `Timetable returned status other than 200 (${err.response.status})`,
          });
      }
    }

    const timeTableObj: timetableApiType = {
      title: timetableList.getTitle(),
      days: timetableList.getDayNames(),
      generatedDate: timetableList.getGeneratedDate(),
      validDate: timetableList.getVersionInfo(),
      lessons: timetableList.getDays(),
      hours: timetableList.getHours(),
    };

    cache.set(id, timeTableObj);

    res.status(200).send(timeTableObj);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      msg: "An error occurred",
      err: error.message,
    });
  }
}
