import { toast } from "@/hooks/useToast";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { Trash2 } from "lucide-react";

export const handleFavorite = (item: ListItem) => {
  const { favorites, addFavorite, removeFavorite } =
    useFavoritesStore.getState();

  if (!item.name) return;

  // const map = {
  //   class: "classes",
  //   teacher: "teachers",
  //   room: "rooms",
  // } as const;

  const isAlreadyFavorite = favorites.some((c) => c.name === item.name);

  if (isAlreadyFavorite) {
    removeFavorite(item.name);
    toast({
      title: "Usunięto z ulubionych",
      description: `Pomyślne usunięto z ulubionych: ${item.name}`,
      icon: Trash2,
      iconColor: "#EF0933",
    });
    return;
  }

  // const currentSelectionObject = timetable.list[map[timetable.type]];
  // const favoriteItem = currentSelectionObject?.find(
  //   (c) => c.name === timetable.title,
  // );

  addFavorite({
    ...item,
  });

  toast({
    title: "Dodano do ulubionych",
    description: `Pomyślnie dodano do ulubionych: ${item.name}`,
  });
  return;
};
