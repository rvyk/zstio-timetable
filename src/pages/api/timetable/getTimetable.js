import { Table } from "@wulkanowy/timetable-parser";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

export default async function handler(req, res) {
  try {
    let { id } = req.query;

    if (!id) {
      id = "o1";
    }

    const cachedData = cache.get(id);
    if (cachedData) {
      return res.status(200).send(cachedData);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`
    );
    const data = await response.text();

    if (response.status !== 200) {
      switch (response.status) {
        case 404:
          return res.status(404).send({
            success: false,
            msg: `Nie znaleziono danych o id ${id}`,
          });
        default:
          return res.status(500).send({
            success: false,
            msg: "ZSTiO Elektronika returned status other than 200",
          });
      }
    }

    const timetableList = new Table(data);
    const timeTableObj = {
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
