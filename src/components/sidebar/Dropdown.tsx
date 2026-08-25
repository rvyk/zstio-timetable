import { LinkWithCookie } from "@/components/common/Link";
import { useT } from "@/components/common/LocaleProvider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import type { TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useRecentStore } from "@/stores/recent";
import { useSettingsWithoutStore } from "@/stores/settings";
import type { ListItem } from "@majusss/timetable-parser";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { CSSProperties, FC } from "react";
import { useIsClient } from "usehooks-ts";
import { FavoriteStar } from "../common/FavoriteStar";
import { useSidebarContext } from "./Context";

const LABELS = {
  favorites: "list.favorites",
  class: "list.class",
  teacher: "list.teacher",
  room: "list.room",
} as const satisfies Record<
  Exclude<DropdownProps["type"], "search">,
  TranslationKey
>;

const NAVIGABLE_TYPES = ["class", "teacher", "room"] as const;

const isNavigableType = (
  value: DropdownProps["type"],
): value is (typeof NAVIGABLE_TYPES)[number] =>
  NAVIGABLE_TYPES.includes(value as (typeof NAVIGABLE_TYPES)[number]);

export interface DropdownProps {
  type: "class" | "teacher" | "room" | "favorites" | "search";
  icon: LucideIcon;
  data?: ListItem[];
  className?: string;
  useModal?: boolean;
}

export const Dropdown: FC<DropdownProps> = ({
  type,
  icon: Icon,
  data,
  className,
  useModal = false,
}) => {
  const translate = useT();
  const { isPreview } = useSidebarContext();
  const isClient = useIsClient();

  const itemCount = data?.length ?? 0;
  if (itemCount === 0 && type !== "favorites") {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(LABELS, type)) {
    return null;
  }

  const label = translate(LABELS[type as keyof typeof LABELS]);

  const triggerContent = (
    <div className="flex w-full items-center justify-between rounded-md">
      <div className="inline-flex items-center gap-x-3">
        <div
          className={cn(
            "border-lines bg-accent grid size-8 place-content-center rounded-md border transition-colors",
            "group-hover:bg-primary/5 group-data-[state=open]:bg-primary/5",
          )}
        >
          <Icon
            className="text-primary/50 group-hover:text-primary group-data-[state=open]:text-primary size-4 transition-colors"
            strokeWidth={1.75}
          />
        </div>
        <p
          className={cn(
            isPreview && "hidden",
            "text-primary/70 group-hover:text-primary group-data-[state=open]:text-primary text-sm font-medium transition-colors",
          )}
        >
          {label}
          {isClient && (
            <span className="text-primary/35 tabular ml-1.5 font-mono text-[11px]">
              {itemCount}
            </span>
          )}
        </p>
      </div>
      <ChevronDown
        className={cn(
          isPreview && "hidden",
          "text-primary/35 size-4 transition-transform duration-300 group-data-[state=open]:rotate-180",
        )}
        strokeWidth={2}
      />
    </div>
  );

  if (useModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={cn(
              "group border-lines bg-foreground text-primary/70 hover:text-primary hover:border-primary/20 inline-flex h-9 items-center gap-2 rounded-lg border pr-2.5 pl-3 text-sm font-medium transition-colors active:scale-[0.98]",
              className,
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            {label}
            <span className="text-primary/30 tabular font-mono text-[11px]">
              {isClient ? itemCount : ""}
            </span>
            <ChevronDown className="text-primary/30 size-3.5" strokeWidth={2} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl gap-5">
          <DialogHeader>
            <DialogTitle>
              {label}
              {isClient && (
                <span className="text-primary/35 tabular ml-2 font-mono text-sm font-normal">
                  {itemCount}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <DropdownContent
            type={type}
            data={data}
            className="-mx-2 max-h-[60vh] px-2 sm:grid-cols-2 lg:grid-cols-3"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AccordionItem value={type} disabled={isPreview} className={cn(className)}>
      <AccordionTrigger
        asChild={isPreview}
        className={cn(
          isPreview && "pointer-events-none select-none",
          "group w-full rounded-lg p-2 transition-colors",
          "hover:bg-primary/4 data-[state=open]:bg-primary/4",
        )}
      >
        {triggerContent}
      </AccordionTrigger>
      <AccordionContent>
        <DropdownContent type={type} data={data} className="mt-2 pl-3" />
      </AccordionContent>
    </AccordionItem>
  );
};

interface DropdownContentProps {
  type: DropdownProps["type"];
  data?: ListItem[];
  className?: string;
  onSelect?: () => void;
}

export const DropdownContent: FC<DropdownContentProps> = ({
  type,
  data,
  className,
  onSelect,
}) => {
  const translate = useT();

  return (
    <div
      className={cn(
        "grid max-h-72 grid-cols-1 gap-0.5 overflow-y-auto py-1",
        className,
      )}
    >
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <ListItemComponent
            key={`${type}-${item.value}`}
            item={item}
            type={type}
            onClick={onSelect}
            style={{ animationDelay: `${Math.min(index, 12) * 20}ms` }}
          />
        ))
      ) : (
        <p className="text-primary/40 px-4 py-3 text-sm">
          {translate("list.empty")}
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
  ListItemComponentProps & { favoriteStar?: boolean; style?: CSSProperties }
> = ({ item, type, onClick, favoriteStar = true, style }) => {
  const translate = useT();
  const addRecent = useRecentStore((state) => state.addRecent);
  const { toggleSidebar, isSidebarOpen } = useSettingsWithoutStore();

  const pathname = usePathname();
  const rawType = (item.type ?? type) as DropdownProps["type"];
  const itemType = isNavigableType(rawType) ? rawType : NAVIGABLE_TYPES[0];
  const link = `/${itemType}/${item.value}`;

  const handleButton = () => {
    // historia zbiera tylko trafienia z wyszukiwarki — lista klas czy sal to
    // przeglądanie, nie wyszukiwanie
    if (type === "search") addRecent({ ...item, type: itemType });
    if (isSidebarOpen) {
      toggleSidebar();
    }
    onClick?.();
  };

  const isActive = pathname === link;

  return (
    <LinkWithCookie
      onClick={handleButton}
      aria-label={translate("timetable.goTo", { target: item.name })}
      aria-current={isActive ? "page" : undefined}
      href={link}
      style={style}
      className={cn(
        "animate-rise",
        isActive
          ? "text-primary bg-primary/6 font-medium"
          : "text-primary/65 hover:text-primary hover:bg-primary/4",
        "group flex w-full min-w-0 items-center justify-between gap-x-2 rounded-md px-3 py-2 text-sm transition duration-150 active:scale-[0.99] max-md:min-h-11",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            isActive ? "bg-accent-table scale-100" : "scale-0 bg-transparent",
            "ease-out-quint size-1.5 shrink-0 rounded-full transition duration-300",
          )}
        />
        <span className="truncate">{item.name}</span>
      </span>
      {favoriteStar && (
        <FavoriteStar item={{ ...item, type: itemType }} small revealOnHover />
      )}
    </LinkWithCookie>
  );
};
