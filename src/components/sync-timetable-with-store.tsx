"use client";

import { useTimetableStore } from "@/hooks/useTimetable";
import { OptivumTimetable } from "@/types/optivum";
import { useEffect } from "react";

const SyncTimetableWithStore = ({
  timetable,
}: {
  timetable: OptivumTimetable;
}) => {
  const setTimetable = useTimetableStore((state) => state.setTimetable);

  useEffect(() => {
    setTimetable(timetable);
  }, [timetable, setTimetable]);

  return null;
};

export default SyncTimetableWithStore;
