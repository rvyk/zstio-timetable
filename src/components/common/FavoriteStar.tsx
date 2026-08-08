"use client";

import { handleFavorite } from "@/lib/handleFavorites";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { StarIcon } from "lucide-react";
import { FC, useMemo } from "react";

interface FavoriteStarProps {
  item: ListItem;
  small?: boolean;
  className?: string;
  /** Hide until the containing `group` row is hovered/focused (list context). */
  revealOnHover?: boolean;
}

export const FavoriteStar: FC<FavoriteStarProps> = ({
  item,
  small,
  className,
  revealOnHover,
}) => {
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
      className={cn(
        "text-primary/30 hover:text-primary/60 shrink-0 rounded-sm transition-all",
        revealOnHover &&
          !isFavorite &&
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 max-md:opacity-100",
        className,
      )}
    >
      <StarIcon
        strokeWidth={2}
        className={cn(
          isFavorite
            ? "fill-[#E0A32E] stroke-[#E0A32E]"
            : "fill-transparent stroke-current",
          small ? "size-3.5" : "size-4.5",
          "transition-colors",
        )}
      />
    </button>
  );
};
