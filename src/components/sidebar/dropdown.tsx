import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsClient } from "usehooks-ts";
import { LinkWithCookie } from "../link";

export const Dropdown: React.FC<{
  type: string;
  icon: LucideIcon;
  data?: ListItem[] | undefined;
}> = ({ type, icon: Icon, data }) => {
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
  type: string;
  data: ListItem[] | undefined;
}> = ({ type, data }) => {
  const pathname = usePathname();

  return (
    <div className="mt-4 grid gap-2 rounded-md bg-accent/90 p-4">
      {data?.length ? (
        data?.map((item, i) => {
          const link = `/${item?.type ? item.type : type}/${item.value}`;

          return (
            <LinkWithCookie
              aria-label={`Przejdź do ${item.name}`}
              href={link}
              key={i}
              className={cn(
                pathname == link &&
                  "!border-primary/5 bg-primary/5 hover:border-primary/10 hover:!bg-primary/10 dark:!bg-primary/5 hover:dark:!bg-primary/10",
                "rounded-md border border-transparent py-3 pl-6 pr-3 text-sm font-semibold text-primary/80 transition-all hover:border-primary/5 hover:bg-primary/5 dark:font-medium hover:dark:bg-primary/5",
              )}
            >
              {item.name}
            </LinkWithCookie>
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
