import { toast } from "@/hooks/useToast";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { Trash2 } from "lucide-react";

export const handleFavorite = (item: ListItem) => {
  const { favorites, addFavorite, removeFavorite } =
    useFavoritesStore.getState();

  if (!item.name) return;

  const isAlreadyFavorite = favorites.some((c) => c.name === item.name);

  if (isAlreadyFavorite) {
    removeFavorite(item.name);
    toast({
      title: "Usunięto z ulubionych",
      description: item.name,
      icon: Trash2,
    });
    return;
  }

  addFavorite({
    ...item,
  });

  toast({
    title: "Dodano do ulubionych",
    description: item.name,
  });
};
