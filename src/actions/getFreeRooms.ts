"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { Room } from "@/types/optivum";
import { unstable_cache } from "next/cache";
import { getOptivumList } from "./getOptivumList";
import { getOptivumTimetable } from "./getOptivumTimetable";

const combineRooms = async (): Promise<Room[]> => {
  const { rooms } = await getOptivumList();
  if (!rooms) return [];

  const roomPromises = rooms.map(async (room) => {
    const { title, lessons } = await getOptivumTimetable("room", room.value);

    return {
      id: room.value,
      title,
      lessons,
    };
  });

  return Promise.all(roomPromises);
};

export const getFreeRooms = async (
  weekdayIndex: number,
  lessonIndex: number,
) => {
  const rooms = await unstable_cache(() => combineRooms(), ["combinedRooms"], {
    revalidate: REVALIDATE_TIME,
  })();

  const emptyRooms = rooms.filter(
    (room) => !room.lessons?.[weekdayIndex][lessonIndex]?.length,
  );

  return emptyRooms;
};
