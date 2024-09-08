"use server";

import { TimetableList } from "@majusss/timetable-parser";

const fetchOptivumList = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`,
  );
  const data = await res.text();
  return new TimetableList(data).getList();
};

export default fetchOptivumList;
