import { create } from "zustand";
import { persist } from "zustand/middleware";

type LessonType = "normal" | "short" | "custom";

interface TimetableSettingsStore {
  lessonType: LessonType;
  setLessonType: (lessonType: LessonType) => void;
  hoursAdjustIndex: number;
  enableCustomLessonsLength: (hoursAdjustIndex: number) => void;
  isSubstitutionShown: boolean;
  toggleSubstitution: () => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
  isShowDiffsEnabled: boolean;
  toggleShowDiffs: () => void;
}

export const useSettingsStore = create<TimetableSettingsStore>()(
  persist(
    (set) => ({
      lessonType: "normal",
      setLessonType: (lessonType) => set({ lessonType }),
      hoursAdjustIndex: 7,
      enableCustomLessonsLength: (hoursAdjustIndex) =>
        set({ hoursAdjustIndex, lessonType: "custom" }),
      isSubstitutionShown: true,
      toggleSubstitution: () =>
        set((state) => ({ isSubstitutionShown: !state.isSubstitutionShown })),
      isNotificationEnabled: false,
      toggleNotification: () =>
        set((state) => ({
          isNotificationEnabled: !state.isNotificationEnabled,
        })),
      isShowDiffsEnabled: false,
      toggleShowDiffs: () =>
        set((state) => ({ isShowDiffsEnabled: !state.isShowDiffsEnabled })),
    }),
    {
      name: "timetable-settings",
    },
  ),
);

interface useSettingsWithoutStore {
  isSettingsPanelOpen: boolean;
  toggleSettingsPanel: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  selectedDayIndex: number;
  setSelectedDayIndex: (selectedDayIndex: number) => void;
}

export const useSettingsWithoutStore = create<useSettingsWithoutStore>(
  (set) => ({
    isSettingsPanelOpen: false,
    toggleSettingsPanel: () =>
      set((state) => ({ isSettingsPanelOpen: !state.isSettingsPanelOpen })),

    isSidebarOpen: false,
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    selectedDayIndex: [0, 6].includes(new Date().getDay())
      ? 0
      : new Date().getDay() - 1,
    setSelectedDayIndex: (selectedDayIndex) => set({ selectedDayIndex }),
  }),
);
