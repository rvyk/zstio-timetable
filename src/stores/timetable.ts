import { OptivumTimetable } from "@/types/optivum";
import { create } from "zustand";

interface TimetableStore {
  timetable: OptivumTimetable | null;
  setTimetable: (timetable: OptivumTimetable) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  timetable: null,
  setTimetable: (timetable) => set({ timetable }),
}));
