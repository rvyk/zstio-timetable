"use client";

import { Accordion } from "@/components/ui/accordion";
import { getUniqueSubstitutionList } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { GraduationCap, MapPin, StarIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, Fragment, memo, useMemo } from "react";
import { useIsClient } from "usehooks-ts";
import { Skeleton } from "../ui/skeleton";
import { Dropdown } from "./dropdown";
import { Search } from "./search";

export const Sidebar: FC = memo(() => {
  return (
    <div className="h-screen w-full max-w-xs border-r border-lines bg-foreground dark:border-primary/10">
      <div className="mr-3 flex h-full w-full flex-col justify-between space-y-16 overflow-y-auto overflow-x-hidden px-4 py-6">
        <SidebarContent />
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarContent: FC = memo(() => {
  const isClient = useIsClient();
  const isSubstitutionPage = usePathname() === "/substitutions";
  const sourceLink = isSubstitutionPage
    ? process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL
    : process.env.NEXT_PUBLIC_TIMETABLE_URL;

  if (!isClient)
    return (
      <Fragment>
        <div className="grid gap-10">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-5">
            <Skeleton className="h-10 w-full" />
            {!isSubstitutionPage && (
              <hr className="h-px w-full border border-primary/10" />
            )}
            <Skeleton className="h-10 w-full" />
            {!isSubstitutionPage && <Skeleton className="h-10 w-full" />}
            {!isSubstitutionPage && <Skeleton className="h-10 w-full" />}
          </div>
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-full" />
        </div>
      </Fragment>
    );

  return (
    <>
      {isSubstitutionPage ? (
        <SubstitutionSidebarDropdowns />
      ) : (
        <TimetableSidebarDropdowns />
      )}

      <p className="mx-2 text-sm font-semibold text-primary/90">
        Źródło danych <br />
        <Link
          href={sourceLink ?? "#"}
          target="_blank"
          className="break-words text-xs font-medium text-primary/70 underline"
        >
          {sourceLink}
        </Link>
      </p>
    </>
  );
});
SidebarContent.displayName = "SidebarContent";

const SubstitutionSidebarDropdowns: FC = memo(() => {
  const substitutions = useSubstitutionsStore((state) => state.substitutions);

  const dropdownItems = useMemo(() => {
    if (!substitutions) return [];
    return [
      {
        type: "teacher" as const,
        icon: Users,
        data: getUniqueSubstitutionList("teacher", substitutions),
      },
      {
        type: "class" as const,
        icon: GraduationCap,
        data: getUniqueSubstitutionList("class", substitutions),
      },
    ];
  }, [substitutions]);

  if (!substitutions) return null;

  return (
    <div className="grid gap-10">
      <Search substitutions={substitutions} />
      <Accordion type="multiple" className="grid w-full gap-5 px-2">
        {dropdownItems.map((item) => (
          <Dropdown
            key={item.type}
            type={item.type}
            icon={item.icon}
            data={item.data}
          />
        ))}
      </Accordion>
    </div>
  );
});
SubstitutionSidebarDropdowns.displayName = "SubstitutionSidebarDropdowns";

const TimetableSidebarDropdowns: FC = memo(() => {
  const { timetable } = useTimetableStore();
  const favorites = useFavoritesStore((state) => state.getFavorites());
  const { classes, teachers, rooms } = timetable?.list ?? {};

  const dropdownItems = useMemo(() => {
    return [
      { type: "favorites" as const, icon: StarIcon, data: favorites },
      { type: "class" as const, icon: GraduationCap, data: classes },
      { type: "teacher" as const, icon: Users, data: teachers },
      { type: "room" as const, icon: MapPin, data: rooms },
    ];
  }, [favorites, classes, teachers, rooms]);

  return (
    <div className="grid gap-10">
      <Search timetable={timetable} />
      <Accordion type="multiple" className="grid w-full gap-5 px-2">
        {dropdownItems.map((item, index) => (
          <Fragment key={item.type}>
            <Dropdown type={item.type} icon={item.icon} data={item.data} />
            {index === 0 && (
              <hr className="h-px w-full border border-primary/10" />
            )}
          </Fragment>
        ))}
      </Accordion>
    </div>
  );
});
TimetableSidebarDropdowns.displayName = "TimetableSidebarDropdowns";
