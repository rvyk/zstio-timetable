import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { allApiType, emptyApiType } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { dayIndex, lessonIndex }: { dayIndex: number; lessonIndex: number } =
      {
        // @ts-ignore
        dayIndex: parseInt(req?.query?.day),
        // @ts-ignore
        lessonIndex: parseInt(req?.query?.lesson),
      };

    if (isNaN(dayIndex) || isNaN(lessonIndex)) {
      return res.status(400).send({
        success: false,
        msg: `Specify dayIndex and lessonIndex to continue`,
      });
    }

    const all: allApiType = (
      await axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/timetable/all`)
    )?.data;

    const responseObj: emptyApiType = { success: true, classes: [] };

    for (const classObj of all.classes) {
      if (classObj.lessons[dayIndex][lessonIndex]?.length === 0)
        responseObj.classes.push({
          name: classObj.title,
          value: classObj.id,
        });
    }

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
