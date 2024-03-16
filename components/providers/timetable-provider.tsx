"use client";

import { OptivumTimetable } from "@/types/timetable";
import React from "react";

export const TimetableContext = React.createContext<OptivumTimetable | null>(null);

const TimetableProvider: React.FC<{
    children: React.ReactNode;
    value: OptivumTimetable;
}> = ({ children, value }) => {
    return <TimetableContext.Provider value={value}>{children}</TimetableContext.Provider>;
};

export default TimetableProvider;
