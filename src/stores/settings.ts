import { create } from "zustand";
import { persist } from "zustand/middleware";

type LessonType = "normal" | "short" | "custom";

interface TimetableSettingsStore {
  lessonType: LessonType;
  setLessonType: (lessonType: LessonType) => void;
  hoursAdjustIndex: number;
  enableCustomLessonsLength: (hoursAdjustIndex: number) => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
}

export const useSettingsStore = create<TimetableSettingsStore>()(
  persist(
    (set) => ({
      lessonType: "normal",
      setLessonType: (lessonType) => set({ lessonType }),
      hoursAdjustIndex: 7,
      enableCustomLessonsLength: (hoursAdjustIndex) =>
        set({ hoursAdjustIndex, lessonType: "custom" }),
      isNotificationEnabled: false,
      toggleNotification: () =>
        set((state) => ({
          isNotificationEnabled: !state.isNotificationEnabled,
        })),
    }),
    {
      name: "timetable-settings",
    },
  ),
);

interface useSettingsWithoutStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  selectedDayIndex: number;
  setSelectedDayIndex: (selectedDayIndex: number) => void;
}

export const useSettingsWithoutStore = create<useSettingsWithoutStore>(
  (set) => ({
    isSidebarOpen: false,
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    isSidebarCollapsed: false,
    setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
    toggleSidebarCollapsed: () =>
      set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    selectedDayIndex: [0, 6].includes(new Date().getDay())
      ? 0
      : new Date().getDay() - 1,
    setSelectedDayIndex: (selectedDayIndex) => set({ selectedDayIndex }),
  }),
);
