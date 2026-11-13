import { useT } from "@/components/common/LocaleProvider";
import type { TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { OptivumTimetable } from "@/types/optivum";
import type { List } from "@majusss/timetable-parser";
import {
  ChevronDown,
  GraduationCap,
  LucideIcon,
  MapPin,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useIsClient } from "usehooks-ts";

const SECTIONS: {
  type: OptivumTimetable["type"];
  key: keyof List;
  label: TranslationKey;
  icon: LucideIcon;
}[] = [
  { type: "class", key: "classes", label: "list.class", icon: GraduationCap },
  { type: "teacher", key: "teachers", label: "list.teacher", icon: Users },
  { type: "room", key: "rooms", label: "list.room", icon: MapPin },
];

export const NoScriptList: FC<{ list: List }> = ({ list }) => {
  const translate = useT();
  const pathname = usePathname();
  const isClient = useIsClient();

  if (isClient) return null;

  const openType =
    SECTIONS.find(({ type }) => pathname.startsWith(`/${type}/`))?.type ??
    "class";

  return (
    <div className="grid w-full gap-1 in-data-js:hidden">
      {SECTIONS.map(({ type, key, label, icon: Icon }) => {
        const items = list[key] ?? [];
        if (items.length === 0) return null;

        return (
          <details
            key={type}
            name="sidebar-lists"
            open={type === openType}
            className="group/section text-sm"
          >
            <summary className="group hover:bg-primary/4 group-open/section:bg-primary/4 flex w-full cursor-pointer list-none items-center justify-between rounded-lg p-2 font-medium transition-colors [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-x-3">
                <span className="border-lines bg-accent group-hover:bg-primary/5 group-open/section:bg-primary/5 grid size-8 place-content-center rounded-md border transition-colors">
                  <Icon
                    className="text-primary/65 group-hover:text-primary group-open/section:text-primary size-4 transition-colors"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="text-primary/80 group-hover:text-primary group-open/section:text-primary transition-colors">
                  {translate(label)}
                  <span className="text-primary tabular ml-1.5 font-mono text-[11px] opacity-60">
                    {items.length}
                  </span>
                </span>
              </span>
              <ChevronDown
                className="text-primary size-4 opacity-50 transition-transform duration-300 group-open/section:rotate-180"
                strokeWidth={2}
              />
            </summary>
            <div className="mt-2 grid max-h-72 grid-cols-1 gap-0.5 overflow-y-auto py-1">
              {items.map((item) => {
                const href = `/${type}/${item.value}`;
                const isActive = pathname === href;

                return (
                  <a
                    key={href}
                    href={href}
                    aria-label={translate("timetable.goTo", {
                      target: item.name,
                    })}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      isActive
                        ? "text-primary bg-primary/6 border-accent-table/60 font-medium"
                        : "text-primary/75 hover:text-primary hover:bg-primary/4 border-transparent",
                      "flex w-full min-w-0 items-center gap-2 rounded-md border px-3 py-2 transition duration-150",
                    )}
                  >
                    <span
                      className={cn(
                        isActive
                          ? "bg-accent-table scale-100"
                          : "scale-0 bg-transparent",
                        "size-1.5 shrink-0 rounded-full",
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
};
