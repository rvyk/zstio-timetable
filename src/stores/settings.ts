import { create } from "zustand";
import { persist } from "zustand/middleware";

type LessonType = "normal" | "short" | "custom";

export type A11yKey = "text" | "contrast" | "motion";

export type A11ySettings = Record<A11yKey, boolean>;

/**
 * Ustawienia dostępności siedzą na `<html>` jako `data-a11y-*`, a resztę robi
 * CSS. Przy starcie atrybuty ustawia skrypt w layoucie (inaczej większy tekst
 * mrugałby po hydracji), tutaj tylko przy zmianie.
 */
const applyA11y = (a11y: A11ySettings) => {
  if (typeof document === "undefined") return;
  for (const [key, enabled] of Object.entries(a11y)) {
    document.documentElement.toggleAttribute(`data-a11y-${key}`, enabled);
  }
};

interface TimetableSettingsStore {
  lessonType: LessonType;
  setLessonType: (lessonType: LessonType) => void;
  hoursAdjustIndex: number;
  enableCustomLessonsLength: (hoursAdjustIndex: number) => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
  a11y: A11ySettings;
  toggleA11y: (key: A11yKey) => void;
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
      a11y: { text: false, contrast: false, motion: false },
      toggleA11y: (key) =>
        set((state) => {
          const a11y = { ...state.a11y, [key]: !state.a11y[key] };
          applyA11y(a11y);
          return { a11y };
        }),
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

    // -1 = "jeszcze nie wybrano", rozwiązywane przy renderze na dzisiejszy
    // dzień. Liczenie daty tutaj zamrażało ją na starcie procesu serwera.
    selectedDayIndex: -1,
    setSelectedDayIndex: (selectedDayIndex) => set({ selectedDayIndex }),
  }),
);
