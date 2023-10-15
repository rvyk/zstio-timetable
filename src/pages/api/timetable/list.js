import { TimetableList } from "@wulkanowy/timetable-parser";

export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.TIMETABLE_URL}/lista.html`);
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
