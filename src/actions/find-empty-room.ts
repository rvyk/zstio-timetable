"use server";

import { TableLesson } from "@majusss/timetable-parser";
import { fetchOptivumList } from "../lib/fetchers/optivum-list";
import { fetchOptivumTimetable } from "../lib/fetchers/optivum-timetable";

interface Room {
  id: string;
  title: string;
  lessons: TableLesson[][][];
}

const combineRooms = async (): Promise<Room[]> => {
  const { rooms } = await fetchOptivumList();
  if (!rooms) return [];
  const roomPromises = rooms.map(async (room) => {
    const { title, lessons } = await fetchOptivumTimetable("room", room.value);
    return {
      id: room.value,
      title,
      lessons,
    };
  });
  return Promise.all(roomPromises);
};

export const findEmptyRoom = async (
  weekdayIndex: number,
  lessonIndex: number,
) => {
  const rooms = await combineRooms();

  const emptyRooms = rooms.filter(
    (room) => !room.lessons[weekdayIndex][lessonIndex]?.length,
  );

  return emptyRooms;
};
