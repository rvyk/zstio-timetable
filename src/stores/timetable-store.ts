import { OptivumTimetable } from "@/types/optivum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimetableStore {
  timetable: OptivumTimetable | null;
  setTimetable: (timetable: OptivumTimetable) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  timetable: null,
  setTimetable: (timetable) => set({ timetable }),
}));

interface TimetableSettingsStore {
  isShortLessons: boolean;
  toggleShortLessons: () => void;
}

export const useTimetableSettings = create<TimetableSettingsStore>()(
  persist(
    (set) => ({
      isShortLessons: false,
      toggleShortLessons: () =>
        set((state) => ({ isShortLessons: !state.isShortLessons })),
    }),
    {
      name: "timetable-settings",
    },
  ),
);
