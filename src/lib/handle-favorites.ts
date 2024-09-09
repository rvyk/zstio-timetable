import { useFavoritesStore } from "@/stores/favorites-store";
import { useTimetableStore } from "@/stores/timetable-store";

// I know that it can be done more simply by simply taking timetable.id and truncate the first character, possibly to be changed
export const handleFavorite = () => {
  const timetable = useTimetableStore.getState().timetable;
  const { favorites, addFavorite, removeFavorite } =
    useFavoritesStore.getState();

  if (!timetable?.title) return;

  const map = {
    class: "classes",
    teacher: "teachers",
    room: "rooms",
  } as const;

  const isAlreadyFavorite = favorites.some((c) => c.name === timetable.title);

  if (isAlreadyFavorite) {
    removeFavorite(timetable.title);
    return;
  }

  const currentSelectionObject = timetable.list[map[timetable.type]];
  const favoriteItem = currentSelectionObject?.find(
    (c) => c.name === timetable.title,
  );

  if (favoriteItem) {
    addFavorite({
      ...favoriteItem,
      type: timetable.type,
    });
    return;
  }
};
