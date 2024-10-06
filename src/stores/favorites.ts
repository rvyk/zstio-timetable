import { ListItem } from "@majusss/timetable-parser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favorites: ListItem[];
  addFavorite: (item: ListItem) => void;
  removeFavorite: (value: string) => void;
  getFavorites: () => ListItem[];
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),

      removeFavorite: (name) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.name !== name),
        })),

      getFavorites: () => get().favorites,
    }),
    {
      name: "favorites",
    },
  ),
);
