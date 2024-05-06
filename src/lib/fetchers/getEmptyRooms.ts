"use server";

import combineAllRooms from "@/lib/fetchers/combineAllRooms";
import fetchSubstitutions from "@/lib/fetchers/fetchSubstitutions";
import { cases } from "@/lib/utils";

const fetchEmptyClasses = async (dayIndex: number, lessonIndex: number) => {
  if (isNaN(dayIndex) || isNaN(lessonIndex)) {
    throw new Error("Invalid day or lesson index");
  }

  const rooms = await combineAllRooms();

  const emptyRooms = rooms.filter(
    (room) => !room.lessons[dayIndex][lessonIndex]?.length,
  );

  if (process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL) {
    const substitutions = (await fetchSubstitutions()).tables[0];
    if (substitutions?.dayIndex === dayIndex) {
      substitutions.zastepstwa.forEach((sub) => {
        if (
          sub.class &&
          cases.includes(sub.case) &&
          +sub.lesson.split(",")[0] === lessonIndex + 1
        ) {
          emptyRooms.push({
            title: `Z zastępstw: ${sub.class}`,
            id: `zastepstwa-${sub.teacher}`,
            lessons: [],
          });
        }
      });
    }
  }
  return emptyRooms;
};

export default fetchEmptyClasses;
