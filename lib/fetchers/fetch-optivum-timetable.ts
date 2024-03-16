"use server";

import { OptivumTimetable } from "@/types/timetable";
import { Table } from "@wulkanowy/timetable-parser";

const fetchOptivumTimetable = async (type: string, index: string): Promise<OptivumTimetable> => {
    const idMap: Record<string, string> = {
        class: `o${index}`,
        teacher: `n${index}`,
        room: `s${index}`,
    };

    const id = idMap[type] || "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${id}.html`);
    const data = await res.text();

    const timeTableData = new Table(data);

    return {
        hours: timeTableData.getHours(),
        lessons: timeTableData.getDays(),
        generatedDate: timeTableData.getGeneratedDate(),
        title: timeTableData.getTitle(),
        validDate: timeTableData.getVersionInfo(), //TODO: convert data format
        days: timeTableData.getDays(),
        dayNames: timeTableData.getDayNames(),
    };
};

export default fetchOptivumTimetable;
