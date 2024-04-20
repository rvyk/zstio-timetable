"use server";

import { Room } from "@/types/api";
import fetchOptivumList from "./fetchOptivumList";
import fetchOptivumTimetable from "./fetchOptivumTimetable";

const combineAllRooms = async () => {
  const { rooms } = await fetchOptivumList();

  const combinedRooms: Room[] = [];

  for (const { value } of rooms ?? []) {
    const { title, lessons } = await fetchOptivumTimetable("room", value);

    combinedRooms.push({
      title,
      id: value,
      lessons,
    });
  }

  return combinedRooms;
};

export default combineAllRooms;
