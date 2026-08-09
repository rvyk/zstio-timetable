import { toast } from "@/hooks/useToast";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { BookmarkIcon, Trash2 } from "lucide-react";

export const handleFavorite = (item: ListItem) => {
  const { favorites, addFavorite, removeFavorite } =
    useFavoritesStore.getState();

  if (!item.name) return;

  const isAlreadyFavorite = favorites.some((c) => c.name === item.name);

  if (isAlreadyFavorite) {
    removeFavorite(item.name);
    // nazwa planu w tytule: to jedyna informacja, po której poznasz, czego dotyczy
    toast({ title: `Usunięto ${item.name} z ulubionych`, icon: Trash2 });
    return;
  }

  addFavorite({ ...item });
  toast({ title: `Dodano ${item.name} do ulubionych`, icon: BookmarkIcon });
};
