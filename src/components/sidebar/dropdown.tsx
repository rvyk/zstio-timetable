import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsClient } from "usehooks-ts";
import { LinkWithCookie } from "../link";
import { Button, buttonVariants } from "../ui/button";

export interface DropdownProps {
  type: "class" | "teacher" | "room" | "favorites" | "search";
  icon: LucideIcon;
  data?: ListItem[] | string[] | undefined;
}

export const Dropdown: React.FC<DropdownProps> = ({
  type,
  icon: Icon,
  data,
}) => {
  const isClient = useIsClient();

  const translates = {
    favorites: "Ulubione",
    class: "Klasy",
    teacher: "Nauczyciele",
    room: "Sale",
  };

  if (data?.length == 0 && type != "favorites") return null;

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

export const DropdownContent: React.FC<{
  type: DropdownProps["type"];
  data: DropdownProps["data"];
}> = ({ type, data }) => {
  const pathname = usePathname();
  const { handleFilterChange, filters } = useSubstitutionsStore();

  const selectedItems = filters[type as keyof typeof filters];

  return (
    <div className="mt-4 grid gap-2 rounded-md bg-accent/90 p-4">
      {data?.length ? (
        data.map((item, i) => {
          if (typeof item == "string") {
            return (
              <Button
                variant="sidebarItem"
                aria-label={`Zaznacz ${item}`}
                key={i}
                size="fit"
                onClick={() =>
                  handleFilterChange(type as "teacher" | "class", item)
                }
                className={cn(
                  selectedItems.includes(item) &&
                    buttonVariants({
                      variant: "sidebarItemActive",
                      size: "fit",
                    }),
                )}
              >
                {item}
              </Button>
            );
          }

          const link = `/${item.type ? item.type : type}/${item.value}`;

          return (
            <Button key={i} variant="sidebarItem" asChild size="fit">
              <LinkWithCookie
                aria-label={`Przejdź do ${item.name}`}
                href={link}
                className={cn(
                  pathname == link &&
                    buttonVariants({ variant: "sidebarItemActive" }),
                )}
              >
                {item.name}
              </LinkWithCookie>
            </Button>
          );
        })
      ) : (
        <p className="text-center text-sm font-semibold text-primary/70 dark:font-medium">
          Brak danych
        </p>
      )}
    </div>
  );
};
