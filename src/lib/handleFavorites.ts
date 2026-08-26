import { toast } from "@/hooks/useToast";
import type { Translate } from "@/lib/i18n";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { BookmarkIcon, Trash2 } from "lucide-react";

export const handleFavorite = (item: ListItem, translate: Translate) => {
  const { favorites, addFavorite, removeFavorite } =
    useFavoritesStore.getState();

  if (!item.name) return;

  const isAlreadyFavorite = favorites.some((c) => c.name === item.name);

  if (isAlreadyFavorite) {
    removeFavorite(item.name);
    toast({
      title: translate("favorites.removed", { name: item.name }),
      icon: Trash2,
    });
    return;
  }

  addFavorite(item);
  toast({
    title: translate("favorites.added", { name: item.name }),
    icon: BookmarkIcon,
  });
};
