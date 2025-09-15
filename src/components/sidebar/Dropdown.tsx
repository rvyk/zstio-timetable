import { LinkWithCookie } from "@/components/common/Link";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings";
import { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";
import { FavoriteStar } from "../common/FavoriteStar";
import { useSidebarContext } from "./Context";

const translates = {
  favorites: "Ulubione",
  class: "Klasy",
  teacher: "Nauczyciele",
  room: "Sale",
};

export interface DropdownProps {
  type: "class" | "teacher" | "room" | "favorites" | "search";
  icon: LucideIcon;
  data?: ListItem[];
}

export const Dropdown: FC<DropdownProps> = ({ type, icon: Icon, data }) => {
  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

  if (!data || data.length === 0) {
    if (type !== "favorites") return null;
  }

  return (
    <AccordionItem value={type} disabled={isPreview}>
      <AccordionTrigger
        asChild={isPreview}
        className={cn(
          isPreview && "pointer-events-none select-none",
          "group hover:bg-accent/90 data-[state=open]:bg-accent/90 -m-2 w-full rounded-md p-2",
        )}
      >
        <div className="inline-flex w-full items-center justify-between rounded-md">
          <div className="inline-flex items-center gap-x-3.5">
            <div className="border-primary/10 bg-accent group-hover:bg-primary/5 group-data-[state=open]:bg-primary/5 group-hover:dark:bg-accent group-data-[state=open]:dark:bg-accent grid h-9 w-9 place-content-center rounded-sm border transition-all sm:h-10 sm:w-10">
              <Icon
                className="text-primary/80 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 size-4 transition-all sm:size-5"
                strokeWidth={2.5}
              />
            </div>
            <p
              className={cn(
                isPreview && "hidden",
                "text-primary/70 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 text-xs font-semibold sm:text-sm dark:font-medium",
              )}
            >
              {translates[type as keyof typeof translates]}{" "}
              {isClient && `(${data?.length})`}
            </p>
          </div>
          <ChevronDown
            className={cn(
              isPreview && "hidden",
              "text-primary/80 size-4 transition-all group-data-[state=open]:rotate-180 sm:size-5",
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
    <div className="bg-primary/[0.03] dark:bg-accent/90 md:bg-accent/90 mt-4 grid gap-2 rounded-md p-4">
      {data && data.length > 0 ? (
        data.map((item, i) => (
          <ListItemComponent
            key={`${item.value}-${i}-${item.name}`}
            item={item}
            type={type}
          />
        ))
      ) : (
        <p className="text-primary/70 text-center text-xs font-semibold sm:text-sm dark:font-medium">
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
  const link = `/${item.type ?? type}/${item.value}`;

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
          <FavoriteStar
            item={{
              ...item,
              type: item.type ?? type,
            }}
            small
          />
        )}
      </LinkWithCookie>
    </Button>
  );
};
