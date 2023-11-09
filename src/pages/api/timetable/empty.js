import axios from "axios";

export default async function handler(req, res) {
  try {
    const { day: dayIndex, lesson: lessonIndex } = req.query,
      target = req.query?.target || "all";

    console.log(req.query);

    if (!dayIndex || !lessonIndex) {
      return res.status(400).send({
        success: false,
        msg: `Specify dayIndex and lessonIndex to continue`,
      });
    }

    const all = (
      await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/api/timetable/all?target=${target}`,
      )
    )?.data;

    const responseObj = { success: true, classes: [], teachers: [] };

    if (target === "classes" || target === "all")
      for (const classObj of all.classes) {
        if (classObj.lessons[dayIndex][lessonIndex]?.length === 0)
          responseObj.classes.push({
            name: classObj.title,
            value: classObj.id,
          });
      }

    if (target === "teachers" || target === "all")
      for (const teacherObj of all.teachers) {
        if (teacherObj.lessons[dayIndex][lessonIndex]?.length === 0)
          responseObj.teachers.push({
            name: teacherObj.title,
            value: teacherObj.id,
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
