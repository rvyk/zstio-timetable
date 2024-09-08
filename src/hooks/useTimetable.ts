import { OptivumTimetable } from "@/types/optivum";
import { create } from "zustand";

interface TimetableState {
  timetable: OptivumTimetable | null;
  setTimetable: (timetable: OptivumTimetable) => void;
}

export const useTimetableStore = create<TimetableState>((set) => ({
  timetable: null,
  setTimetable: (timetable) => set({ timetable }),
}));
