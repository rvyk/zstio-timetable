import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NewsStore {
  readId: number;
  markRead: (id: number) => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      readId: 0,
      markRead: (id) =>
        set((state) => ({ readId: Math.max(state.readId, id) })),
    }),
    { name: "news" },
  ),
);
