"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import type { Room } from "@/types/optivum";
import { unstable_cache } from "next/cache";
import { getOptivumList } from "./getOptivumList";
import { getOptivumTimetable } from "./getOptivumTimetable";

const combineRooms = async (): Promise<Room[]> => {
  const { rooms: roomList } = await getOptivumList();
  if (!roomList || roomList.length === 0) {
    return [];
  }

  const roomPromises = roomList.map(async (room) => {
    const timetable = await getOptivumTimetable("room", room.value);

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

export const getFreeRoomsWeek = async (
  weekdayCount: number,
  lessonCount: number,
): Promise<string[][][]> => {
  const rooms = await cachedRooms();

  return Array.from({ length: weekdayCount }, (_, dayIndex) =>
    Array.from({ length: lessonCount }, (_, lessonIndex) =>
      rooms
        .filter((room) => !room.lessons?.[dayIndex]?.[lessonIndex]?.length)
        .map((room) => room.id),
    ),
  );
};

const cachedRooms = () =>
  unstable_cache(() => combineRooms(), ["combinedRooms"], {
    revalidate: REVALIDATE_TIME,
  })();

export const getFreeRooms = async (
  weekdayIndex: number,
  lessonIndex: number,
) => {
  if (weekdayIndex < 0 || lessonIndex < 0) {
    return [];
  }

  const rooms = await cachedRooms();

  return rooms.filter((room) => {
    const dayLessons = room.lessons?.[weekdayIndex];
    const lessonEntries = dayLessons?.[lessonIndex];
    return !lessonEntries || lessonEntries.length === 0;
  });
};
