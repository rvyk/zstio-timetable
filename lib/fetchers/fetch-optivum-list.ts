"use server";

import { TimetableList } from "@wulkanowy/timetable-parser";

const fetchOptivumList = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/lista.html`, { cache: "force-cache" });
    const data = await res.text();
    const timeTableList = new TimetableList(data).getList();
    return timeTableList;
};

export default fetchOptivumList;
