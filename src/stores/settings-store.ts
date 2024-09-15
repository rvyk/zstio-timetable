import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimetableSettingsStore {
  isShortLessons: boolean;
  toggleShortLessons: () => void;
}

export const useSettingsStore = create<TimetableSettingsStore>()(
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

interface useSettingsWithoutStore {
  isSettingsPanelOpen: boolean;
  toggleSettingsPanel: () => void;

  isFullscreenMode: boolean;
  toggleFullscreenMode: () => void;
}

export const useSettingsWithoutStore = create<useSettingsWithoutStore>(
  (set) => ({
    isSettingsPanelOpen: false,
    toggleSettingsPanel: () =>
      set((state) => ({ isSettingsPanelOpen: !state.isSettingsPanelOpen })),

    isFullscreenMode: false,
    toggleFullscreenMode: () =>
      set((state) => ({ isFullscreenMode: !state.isFullscreenMode })),
  }),
);
