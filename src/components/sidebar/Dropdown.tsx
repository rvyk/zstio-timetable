import { LinkWithCookie } from "@/components/common/Link";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn, parseSubstitutionClass } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings";
import { useSubstitutionsStore } from "@/stores/substitutions";
import { SubstitutionListItem } from "@/types/optivum";
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

const isListItem = (item: DataItem): item is ListItem => {
  return "value" in item;
};

type DataItem = SubstitutionListItem | ListItem;

export interface DropdownProps {
  type: "class" | "teacher" | "room" | "favorites" | "search";
  icon: LucideIcon;
  data?: DataItem[];
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
          "group -m-2 w-full rounded-md p-2 hover:bg-accent/90 data-[state=open]:bg-accent/90",
        )}
      >
        <div className="inline-flex w-full items-center justify-between rounded-md">
          <div className="inline-flex items-center gap-x-3.5">
            <div className="grid h-9 w-9 place-content-center rounded-sm border border-primary/10 bg-accent transition-all group-hover:bg-primary/5 group-data-[state=open]:bg-primary/5 group-hover:dark:bg-accent group-data-[state=open]:dark:bg-accent sm:h-10 sm:w-10">
              <Icon
                className="size-4 text-primary/80 transition-all group-hover:text-primary/90 group-data-[state=open]:text-primary/90 sm:size-5"
                strokeWidth={2.5}
              />
            </div>
            <p
              className={cn(
                isPreview && "hidden",
                "text-xs font-semibold text-primary/70 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 dark:font-medium sm:text-sm",
              )}
            >
              {translates[type as keyof typeof translates]}{" "}
              {isClient && `(${data?.length})`}
            </p>
          </div>
          <ChevronDown
            className={cn(
              isPreview && "hidden",
              "size-4 text-primary/80 transition-all group-data-[state=open]:rotate-180 sm:size-5",
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

export const DropdownContent: FC<{
  type: DropdownProps["type"];
  data?: DataItem[];
}> = ({ type, data }) => {
  return (
    <div className="mt-4 grid gap-2 rounded-md bg-primary/[0.03] p-4 dark:bg-accent/90 md:bg-accent/90">
      {data && data.length > 0 ? (
        data.map((item, i) =>
          isListItem(item) ? (
            <ListItemComponent
              key={`${item.value}-${i}-${item.name}`}
              item={item}
              type={type}
            />
          ) : (
            <SubstitutionListItemComponent key={item.name} item={item} />
          ),
        )
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

export const ListItemComponent: FC<ListItemComponentProps> = ({
  item,
  type,
  onClick,
}) => {
  const { toggleSidebar, isSidebarOpen } = useSettingsWithoutStore();

  const pathname = usePathname();
  const link = `/${item.type ? item.type : type}/${item.value}`;

  const handleButton = () => {
    isSidebarOpen && toggleSidebar();
    onClick && onClick();
  };

  return (
    <Button onClick={handleButton} variant="sidebarItem" asChild size="fit">
      <LinkWithCookie
        aria-label={`Przejdź do ${item.name}`}
        href={link}
        className={cn(
          pathname === link && buttonVariants({ variant: "sidebarItemActive" }),
          "flex w-full justify-between gap-x-2",
        )}
      >
        {item.name}
        <FavoriteStar
          item={{
            ...item,
            type: item.type ?? type,
          }}
          small
        />
      </LinkWithCookie>
    </Button>
  );
};

interface SubstitutionListItemComponentProps {
  item: SubstitutionListItem;
}

const SubstitutionListItemComponent: FC<SubstitutionListItemComponentProps> = ({
  item,
}) => {
  const { handleFilterChange, filters } = useSubstitutionsStore();

  const itemType = item.type as "teacher" | "class";

  const selectedItems = filters[itemType];
  const isSelected = selectedItems.some(
    (selectedItem) => selectedItem.name === item.name,
  );

  return (
    <Button
      variant="sidebarItem"
      aria-label={`Zaznacz ${item.name}`}
      size="fit"
      onClick={() => handleFilterChange(itemType, item)}
      className={cn(
        isSelected &&
          buttonVariants({
            variant: "sidebarItemActive",
            size: "fit",
          }),
      )}
    >
      {itemType == "class" ? parseSubstitutionClass(item.name) : item.name}
    </Button>
  );
};
