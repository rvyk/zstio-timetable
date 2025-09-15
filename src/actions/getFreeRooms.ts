"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { Room } from "@/types/optivum";
import { unstable_cache } from "next/cache";
import { getActiveDataSource } from "./getActiveDataSource";
import { getOptivumList } from "./getOptivumList";
import { getOptivumTimetable } from "./getOptivumTimetable";

const combineRooms = async (
  dataSource: string = "default",
): Promise<Room[]> => {
  const { rooms } = await getOptivumList(dataSource);
  if (!rooms) return [];

  const roomPromises = rooms.map(async (room) => {
    const { title, lessons } = await getOptivumTimetable(
      "room",
      room.value,
      dataSource,
    );

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
  const baseUrl = await getActiveDataSource();
  const rooms = await unstable_cache(
    () => combineRooms(),
    ["combinedRooms", baseUrl],
    {
      revalidate: REVALIDATE_TIME,
    },
  )();

  const emptyRooms = rooms.filter(
    (room) => !room.lessons?.[weekdayIndex][lessonIndex]?.length,
  );

  return emptyRooms;
};
