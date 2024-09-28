import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingsWithoutStore } from "@/stores/settings-store";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { SubstitutionListItem } from "@/types/optivum";
import { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";
import { LinkWithCookie } from "../link";

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
  const isClient = useIsClient();

  if (!data || data.length === 0) {
    if (type !== "favorites") return null;
  }

  return (
    <AccordionItem value={type}>
      <AccordionTrigger className="group relative">
        <div className="absolute -left-2 -top-1.5 z-10 h-[calc(100%+12px)] w-[calc(100%+16px)] rounded-md bg-accent/90 opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:opacity-100"></div>
        <div className="relative z-20 inline-flex w-full items-center justify-between">
          <div className="inline-flex items-center gap-x-3.5">
            <div className="grid h-10 w-10 place-content-center rounded-sm border border-primary/10 bg-accent transition-all group-hover:bg-primary/5 group-hover:dark:bg-accent">
              <Icon
                className="text-primary/80 transition-all group-hover:text-primary/90 group-data-[state=open]:text-primary/90"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-sm font-semibold text-primary/70 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 dark:font-medium">
              {translates[type as keyof typeof translates]}{" "}
              {isClient && `(${data?.length})`}
            </p>
          </div>
          <ChevronDown
            className="text-primary/80 transition-all group-data-[state=open]:rotate-180"
            size={20}
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
    <div className="mt-4 grid gap-2 rounded-md bg-accent/90 p-4">
      {data && data.length > 0 ? (
        data.map((item) =>
          isListItem(item) ? (
            <ListItemComponent key={item.value} item={item} type={type} />
          ) : (
            <SubstitutionListItemComponent key={item.name} item={item} />
          ),
        )
      ) : (
        <p className="text-center text-sm font-semibold text-primary/70 dark:font-medium">
          Brak danych
        </p>
      )}
    </div>
  );
};

interface ListItemComponentProps {
  item: ListItem;
  type: DropdownProps["type"];
}

const ListItemComponent: FC<ListItemComponentProps> = ({ item, type }) => {
  const { toggleSidebar, isSidebarOpen } = useSettingsWithoutStore();

  const pathname = usePathname();
  const link = `/${item.type ? item.type : type}/${item.value}`;

  return (
    <Button
      onClick={() => isSidebarOpen && toggleSidebar()}
      key={item.value}
      variant="sidebarItem"
      asChild
      size="fit"
    >
      <LinkWithCookie
        aria-label={`Przejdź do ${item.name}`}
        href={link}
        className={cn(
          pathname === link && buttonVariants({ variant: "sidebarItemActive" }),
        )}
      >
        {item.name}
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
      key={item.name}
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
      {item.name}
    </Button>
  );
};
