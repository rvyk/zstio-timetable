import { fetchEmptyClasses } from "@/lib/fetchers/fetchEmptyClasses";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { dayIndex, lessonIndex } = req.query;

    if (!dayIndex || !lessonIndex) {
      return res.status(400).send({
        success: false,
        msg: `Specify dayIndex and lessonIndex to continue`,
      });
    }

    const data = await fetchEmptyClasses(+dayIndex, +lessonIndex);

    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, msg: "An error occurred" });
  }
}
