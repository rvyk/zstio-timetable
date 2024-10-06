"use client";

import { handleFavorite } from "@/lib/handleFavorites";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { StarIcon } from "lucide-react";
import { FC, useMemo } from "react";

export const FavoriteStar: FC<{
  item: ListItem;
  small?: boolean;
}> = ({ item, small }) => {
  const { favorites } = useFavoritesStore();

  const isFavorite = useMemo(() => {
    return favorites.some((c) => c.name === item.name);
  }, [favorites, item.name]);

  return (
    <button
      aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      onClick={(e) => {
        e.preventDefault();
        handleFavorite(item);
      }}
      className="focus:outline-none"
    >
      <StarIcon
        strokeWidth={2.5}
        className={cn(
          isFavorite
            ? "!fill-[#FFB800] drop-shadow-[0_0_5.6px_rgba(255,196,46,0.35)] grayscale-0 hover:drop-shadow-[0_0_6.6px_rgba(255,196,46,0.85)]"
            : "drop-shadow-none grayscale",
          small ? "size-5" : "size-6",
          "fill-transparent stroke-[#FFB800] transition-all duration-300 hover:fill-[#FFB800]",
        )}
      />
    </button>
  );
};
