import { OptivumTimetable } from "@/types/optivum";
import { create } from "zustand";

interface TimetableStore {
  timetable: OptivumTimetable | null;
  printTimetable: (() => void) | null;
  setTimetable: (timetable: OptivumTimetable) => void;
  setPrintTimetable: (printFn: (() => void) | null) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  timetable: null,
  printTimetable: null,
  setTimetable: (timetable) => set({ timetable }),
  setPrintTimetable: (printFn) => set({ printTimetable: printFn }),
}));
