import { TableHour } from "@majusss/timetable-parser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LessonType = "normal" | "short" | "custom";

interface TimetableSettingsStore {
  lessonType: LessonType;
  setLessonType: (lessonType: LessonType) => void;
  customLessonLength: TableHour[];
  enableCustomLessonsLength: (hours: TableHour[]) => void;
  isSubstitutionShown: boolean;
  toggleSubstitution: () => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
}

export const useSettingsStore = create<TimetableSettingsStore>()(
  persist(
    (set) => ({
      lessonType: "normal",
      setLessonType: (lessonType) => set({ lessonType }),
      customLessonLength: [],
      enableCustomLessonsLength: (hours) =>
        set({ customLessonLength: hours, lessonType: "custom" }),
      isSubstitutionShown: true,
      toggleSubstitution: () =>
        set((state) => ({ isSubstitutionShown: !state.isSubstitutionShown })),
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
  isSettingsPanelOpen: boolean;
  toggleSettingsPanel: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  isFullscreenMode: boolean;
  toggleFullscreenMode: () => void;
}

export const useSettingsWithoutStore = create<useSettingsWithoutStore>(
  (set) => ({
    isSettingsPanelOpen: false,
    toggleSettingsPanel: () =>
      set((state) => ({ isSettingsPanelOpen: !state.isSettingsPanelOpen })),

    isSidebarOpen: false,
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    isFullscreenMode: false,
    toggleFullscreenMode: () =>
      set((state) => ({ isFullscreenMode: !state.isFullscreenMode })),
  }),
);
