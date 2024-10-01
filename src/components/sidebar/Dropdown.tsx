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
            <div className="grid h-10 w-10 place-content-center rounded-sm border border-primary/10 bg-accent transition-all group-hover:bg-primary/5 group-data-[state=open]:bg-primary/5 group-hover:dark:bg-accent group-data-[state=open]:dark:bg-accent">
              <Icon
                className="text-primary/80 transition-all group-hover:text-primary/90 group-data-[state=open]:text-primary/90"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <p
              className={cn(
                isPreview && "hidden",
                "text-sm font-semibold text-primary/70 group-hover:text-primary/90 group-data-[state=open]:text-primary/90 dark:font-medium",
              )}
            >
              {translates[type as keyof typeof translates]}{" "}
              {isClient && `(${data?.length})`}
            </p>
          </div>
          <ChevronDown
            className={cn(
              isPreview && "hidden",
              "text-primary/80 transition-all group-data-[state=open]:rotate-180",
            )}
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
    <Button
      key={item.value}
      onClick={handleButton}
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
      {itemType == "class" ? parseSubstitutionClass(item.name) : item.name}
    </Button>
  );
};
