import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { allApiType, emptyApiType } from "@/types/api";
import { getSubstitutionsObject } from "@/utils/getter";
import { cases } from "@/utils/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { dayIndex, lessonIndex }: { dayIndex: number; lessonIndex: number } =
      {
        dayIndex: parseInt(req?.query?.day?.toString()),
        lessonIndex: parseInt(req?.query?.lesson?.toString()),
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
      if (classObj.lessons[dayIndex][lessonIndex]?.length === 0) {
        responseObj.classes.push({
          name: classObj.title,
          value: classObj.id,
        });
      }
    }

    const substitutions = await getSubstitutionsObject();
    if (substitutions.dayIndex === dayIndex) {
      substitutions.zastepstwa.forEach((sub) => {
        if (
          sub.class &&
          cases.includes(sub.case) &&
          +sub.lesson.split(",")[0] === lessonIndex + 1
        ) {
          responseObj.classes.push({
            name: `Z zastępstw: ${sub.class}`,
            url: `${
              process.env.NEXT_PUBLIC_SUBSTITUTIONS
            }/zastepstwa?teachers=${sub?.teacher.replaceAll(
              " ",
              "+"
            )}&branches=${sub?.branch}`,
          });
        }
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
