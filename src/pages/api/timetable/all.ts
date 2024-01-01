import { allApiType } from "@/types/api";
import fetchTimetableList from "@/utils/fetchTimetableList";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 5400 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const cachedData: allApiType = cache.get("all");
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

    const { classes } = data;

    const responseObj: allApiType = { success: true, classes: [] };

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
    cache.set("all", responseObj);

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
