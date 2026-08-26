import { ListItem } from "@majusss/timetable-parser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favorites: ListItem[];
  addFavorite: (item: ListItem) => void;
  removeFavorite: (name: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],

      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),

      removeFavorite: (name) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.name !== name),
        })),
    }),
    {
      name: "favorites",
    },
  ),
);
