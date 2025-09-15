"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { DATA_SOURCE_COOKIE_NAME } from "@/lib/dataSource";
import type { Room } from "@/types/optivum";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { getActiveDataSource } from "./getActiveDataSource";
import { getOptivumList } from "./getOptivumList";
import { getOptivumTimetable } from "./getOptivumTimetable";

const combineRooms = async (dataSource?: string): Promise<Room[]> => {
  const { rooms: roomList } = await getOptivumList(dataSource);
  if (!roomList || roomList.length === 0) {
    return [];
  }

  const roomPromises = roomList.map(async (room) => {
    const timetable = await getOptivumTimetable("room", room.value, dataSource);

    return {
      id: room.value,
      title: timetable.title,
      lessons: timetable.lessons,
    } satisfies Room;
  });

  const results = await Promise.allSettled(roomPromises);

  const fulfilledRooms: Room[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      fulfilledRooms.push(result.value);
    } else {
      console.warn(
        `Nie udało się pobrać planu sali ${roomList[index]?.value ?? "unknown"}:`,
        result.reason,
      );
    }
  });

  return fulfilledRooms;
};

export const getFreeRooms = async (weekdayIndex: number, lessonIndex: number) => {
  if (weekdayIndex < 0 || lessonIndex < 0) {
    return [];
  }

  const cookieStore = await cookies();
  const requestedSource = cookieStore.get(DATA_SOURCE_COOKIE_NAME)?.value;
  const activeSource = await getActiveDataSource(requestedSource);

  const rooms = await unstable_cache(
    () => combineRooms(activeSource),
    ["combinedRooms", activeSource],
    {
      revalidate: REVALIDATE_TIME,
    },
  )();

  return rooms.filter((room) => {
    const dayLessons = room.lessons?.[weekdayIndex];
    const lessonEntries = dayLessons?.[lessonIndex];
    return !lessonEntries || lessonEntries.length === 0;
  });
};
