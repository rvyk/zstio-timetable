import { toast } from "@/hooks/useToast";
import { useFavoritesStore } from "@/stores/favorites";
import { useTimetableStore } from "@/stores/timetable";
import { Trash2 } from "lucide-react";

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
    toast({
      title: "Usunięto z ulubionych",
      description: `Pomyślne usunięto z ulubionych: ${timetable.title}`,
      icon: Trash2,
      iconColor: "#EF0933",
    });
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

    toast({
      title: "Dodano do ulubionych",
      description: `Pomyślnie dodano do ulubionych: ${timetable.title}`,
    });
    return;
  }
};
