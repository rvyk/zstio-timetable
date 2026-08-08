"use client";

import { handleFavorite } from "@/lib/handleFavorites";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { BookmarkIcon } from "lucide-react";
import { FC, useMemo } from "react";

interface FavoriteStarProps {
  item: ListItem;
  small?: boolean;
  className?: string;
  /** Hide until the containing `group` row is hovered/focused (list context). */
  revealOnHover?: boolean;
  /** Podpis obok ikony — dla samotnego przycisku, gdzie sama ikona nic nie mówi. */
  withLabel?: boolean;
}

export const FavoriteStar: FC<FavoriteStarProps> = ({
  item,
  small,
  className,
  revealOnHover,
  withLabel,
}) => {
  const { favorites } = useFavoritesStore();

  const isFavorite = useMemo(() => {
    return favorites.some((c) => c.name === item.name);
  }, [favorites, item.name]);

  return (
    <button
      aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        handleFavorite(item);
      }}
      className={cn(
        "shrink-0 rounded-sm transition-colors",
        isFavorite
          ? "text-accent-table"
          : "text-primary/40 hover:text-primary/70",
        revealOnHover &&
          !isFavorite &&
          "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100",
        withLabel && "flex items-center gap-1.5",
        className,
      )}
    >
      <BookmarkIcon
        strokeWidth={2}
        className={cn(
          isFavorite ? "fill-current" : "fill-transparent",
          small ? "size-3.5" : "size-4",
        )}
      />
      {withLabel && (
        <span className="text-[13px] leading-none font-medium">
          {isFavorite ? "Zapisany" : "Zapisz"}
        </span>
      )}
    </button>
  );
};
