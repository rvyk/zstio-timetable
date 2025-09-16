import { LinkWithCookie } from "@/components/common/Link";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings";
import type { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";
import { FavoriteStar } from "../common/FavoriteStar";
import { useSidebarContext } from "./Context";

const LABELS: Record<Exclude<DropdownProps["type"], "search">, string> = {
  favorites: "Ulubione",
  class: "Klasy",
  teacher: "Nauczyciele",
  room: "Sale",
};

const NAVIGABLE_TYPES = ["class", "teacher", "room"] as const;

const isNavigableType = (
  value: DropdownProps["type"],
): value is (typeof NAVIGABLE_TYPES)[number] =>
  NAVIGABLE_TYPES.includes(value as (typeof NAVIGABLE_TYPES)[number]);

export interface DropdownProps {
  type: "class" | "teacher" | "room" | "favorites" | "search";
  icon: LucideIcon;
  data?: ListItem[];
}

export const Dropdown: FC<DropdownProps> = ({ type, icon: Icon, data }) => {
  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

  const itemCount = data?.length ?? 0;
  if (itemCount === 0 && type !== "favorites") {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(LABELS, type)) {
    return null;
  }

  const label = LABELS[type as keyof typeof LABELS];

  return (
    <AccordionItem value={type} disabled={isPreview}>
      <AccordionTrigger
        asChild={isPreview}
        className={cn(
          isPreview && "pointer-events-none select-none",
          "group -m-2 w-full rounded-md p-2 transition-colors",
          "hover:bg-accent/90 data-[state=open]:bg-accent/90",
        )}
      >
        <div className="inline-flex w-full items-center justify-between rounded-md">
          <div className="inline-flex items-center gap-x-3.5">
            <div
              className={cn(
                "grid h-9 w-9 place-content-center rounded-sm border transition-all sm:h-10 sm:w-10",
                "border-primary/10 bg-accent",
                "group-hover:bg-primary/5 group-data-[state=open]:bg-primary/5",
                "dark:bg-accent dark:group-hover:bg-accent dark:group-data-[state=open]:bg-accent",
              )}
            >
              <Icon
                className="size-4 text-primary/80 transition-all group-hover:text-primary/90 group-data-[state=open]:text-primary/90 sm:size-5"
                strokeWidth={2.5}
              />
            </div>
            <p
            className={cn(
              isPreview && "hidden",
              "text-xs font-semibold text-primary/70 transition-colors sm:text-sm",
              "group-hover:text-primary/90 group-data-[state=open]:text-primary/90 dark:font-medium",
            )}
          >
              {label} {isClient && `(${itemCount})`}
          </p>
        </div>
          <ChevronDown
            className={cn(
              isPreview && "hidden",
              "size-4 text-primary/80 transition-transform group-data-[state=open]:rotate-180 sm:size-5",
            )}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <DropdownContent type={type} data={data} />
      </AccordionContent>
    </AccordionItem>
  );
};

interface DropdownContentProps {
  type: DropdownProps["type"];
  data?: ListItem[];
}

export const DropdownContent: FC<DropdownContentProps> = ({ type, data }) => {
  return (
    <div className="mt-4 grid gap-2 rounded-md bg-primary/[0.03] p-4 dark:bg-accent/90 md:bg-accent/90">
      {data && data.length > 0 ? (
        data.map((item) => (
          <ListItemComponent key={`${type}-${item.value}`} item={item} type={type} />
        ))
      ) : (
        <p className="text-center text-xs font-semibold text-primary/70 dark:font-medium sm:text-sm">
          Brak danych
        </p>
      )}
    </div>
  );
};

interface ListItemComponentProps {
  item: ListItem;
  type: DropdownProps["type"];
  onClick?: () => void;
}

export const ListItemComponent: FC<
  ListItemComponentProps & { favoriteStar?: boolean }
> = ({ item, type, onClick, favoriteStar = true }) => {
  const { toggleSidebar, isSidebarOpen } = useSettingsWithoutStore();

  const pathname = usePathname();
  const rawType = (item.type ?? type) as DropdownProps["type"];
  const itemType = isNavigableType(rawType) ? rawType : NAVIGABLE_TYPES[0];
  const link = `/${itemType}/${item.value}`;

  const handleButton = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
    onClick?.();
  };

  return (
    <Button onClick={handleButton} variant="sidebarItem" asChild size="fit">
      <LinkWithCookie
        aria-label={`Przejdź do ${item.name}`}
        href={link}
        className={cn(
          pathname === link && buttonVariants({ variant: "sidebarItemActive" }),
          "flex w-full !justify-between gap-x-2",
        )}
      >
        {item.name}
        {favoriteStar && (
          <FavoriteStar item={{ ...item, type: itemType }} small />
        )}
      </LinkWithCookie>
    </Button>
  );
};
