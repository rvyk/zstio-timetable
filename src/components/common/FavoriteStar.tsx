"use client";

import { useT } from "@/components/common/LocaleProvider";
import { handleFavorite } from "@/lib/handleFavorites";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites";
import { ListItem } from "@majusss/timetable-parser";
import { BookmarkIcon } from "lucide-react";
import { FC, useState } from "react";

interface FavoriteStarProps {
  item: ListItem;
  small?: boolean;
  className?: string;
  revealOnHover?: boolean;
  withLabel?: boolean;
}

export const FavoriteStar: FC<FavoriteStarProps> = ({
  item,
  small,
  className,
  revealOnHover,
  withLabel,
}) => {
  const translate = useT();
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((entry) => entry.name === item.name),
  );

  const [clicks, setClicks] = useState(0);

  return (
    <button
      aria-label={translate(isFavorite ? "favorites.remove" : "favorites.add")}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        setClicks((count) => count + 1);
        handleFavorite(item, translate);
      }}
      className={cn(
        "shrink-0 rounded-sm transition-colors",
        isFavorite
          ? "text-accent-table"
          : "text-primary/55 hover:text-primary/80",
        revealOnHover &&
          !isFavorite &&
          "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100",
        withLabel && "flex items-center gap-1.5",
        className,
      )}
    >
      <BookmarkIcon
        key={clicks}
        strokeWidth={2}
        className={cn(
          isFavorite ? "fill-current" : "fill-transparent",
          clicks > 0 && isFavorite && "animate-pop",
          small ? "size-3.5" : "size-4",
        )}
      />
      {withLabel && (
        <span className="text-[13px] leading-none font-medium">
          {translate(isFavorite ? "favorites.saved" : "favorites.save")}
        </span>
      )}
    </button>
  );
};
