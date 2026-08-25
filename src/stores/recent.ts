import { ListItem } from "@majusss/timetable-parser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Ile ostatnio wyszukanych planów pamiętamy. */
const MAX_RECENT = 5;

interface RecentStore {
  recent: ListItem[];
  addRecent: (item: ListItem) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      recent: [],

      addRecent: (item) =>
        set((state) => ({
          recent: [
            item,
            ...state.recent.filter(
              (entry) => entry.value !== item.value || entry.type !== item.type,
            ),
          ].slice(0, MAX_RECENT),
        })),

      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: "recent-searches",
    },
  ),
);
