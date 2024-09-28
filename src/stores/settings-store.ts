import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimetableSettingsStore {
  isShortLessons: boolean;
  toggleShortLessons: () => void;
  isSubstitutionShown: boolean;
  toggleSubstitution: () => void;
  isNotificationEnabled: boolean;
  toggleNotification: () => void;
}

export const useSettingsStore = create<TimetableSettingsStore>()(
  persist(
    (set) => ({
      isShortLessons: false,
      toggleShortLessons: () =>
        set((state) => ({ isShortLessons: !state.isShortLessons })),
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
