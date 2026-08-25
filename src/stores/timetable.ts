import { OptivumTimetable } from "@/types/optivum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimetableStore {
  timetable: OptivumTimetable | null;
  setTimetable: (timetable: OptivumTimetable) => void;
}

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set) => ({
      timetable: null,
      setTimetable: (timetable) => set({ timetable }),
    }),
    {
      name: "timetable-storage",
    },
  ),
);
