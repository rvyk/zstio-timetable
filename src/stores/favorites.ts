import { ListItem } from "@majusss/timetable-parser";
import { deleteCookie, setCookie } from "cookies-next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_PLAN_COOKIE = "defaultPlan";

export const favoritePath = (item: ListItem) =>
  `/${item.type ?? "class"}/${item.value}`;

const syncCookie = (path: string | null) => {
  if (path) {
    setCookie(DEFAULT_PLAN_COOKIE, path, {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  } else {
    deleteCookie(DEFAULT_PLAN_COOKIE, { path: "/" });
  }
};

interface FavoritesStore {
  favorites: ListItem[];
  defaultPath: string | null;
  addFavorite: (item: ListItem) => void;
  removeFavorite: (name: string) => void;
  setDefaultPath: (path: string | null) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      defaultPath: null,

      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),

      removeFavorite: (name) => {
        const removed = get().favorites.find((item) => item.name === name);

        set((state) => ({
          favorites: state.favorites.filter((item) => item.name !== name),
          defaultPath:
            removed && favoritePath(removed) === state.defaultPath
              ? null
              : state.defaultPath,
        }));

        if (get().defaultPath === null) syncCookie(null);
      },

      setDefaultPath: (path) => {
        set({ defaultPath: path });
        syncCookie(path);
      },
    }),
    {
      name: "favorites",
      onRehydrateStorage: () => (state) =>
        syncCookie(state?.defaultPath ?? null),
    },
  ),
);
