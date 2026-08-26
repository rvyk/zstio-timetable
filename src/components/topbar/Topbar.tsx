"use client";

import school_logo from "@/assets/school-logo.png";
import { FavoriteStar } from "@/components/common/FavoriteStar";
import { useT } from "@/components/common/LocaleProvider";
import { SettingsMenu } from "@/components/settings/SettingsPanel";
import { ShortLessonSwitcherCell } from "@/components/timetable/Cells";
import { SCHOOL_SHORT, SCHOOL_WEBSITE } from "@/constants/school";
import type { OptivumTimetable } from "@/types/optivum";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface TopbarProps {
  timetable?: OptivumTimetable;
  showLessonSwitcher?: boolean;
  page?: { title: string; backHref: string; backLabel: string };
}

export const Topbar: FC<TopbarProps> = ({
  timetable,
  showLessonSwitcher = true,
  page,
}) => (
  <header className="grid gap-2 px-3 pt-3 md:hidden">
    <div className="flex w-full items-center justify-between gap-3">
      {page ? <PageLink {...page} /> : <SchoolLink />}
      <div className="flex items-center gap-1">
        {timetable?.title && (
          <FavoriteStar
            item={{
              name: timetable.title,
              value: timetable.id.substring(1),
              type: timetable.type,
            }}
            className="border-lines bg-accent active:bg-primary/5 grid size-11 place-content-center rounded-lg border"
          />
        )}
        <SettingsMenu />
      </div>
    </div>

    {showLessonSwitcher && <ShortLessonSwitcherCell className="px-0 py-0" />}
  </header>
);

const PageLink: FC<NonNullable<TopbarProps["page"]>> = ({
  title,
  backHref,
  backLabel,
}) => (
  <Link
    href={backHref}
    className="group -m-1 flex min-w-0 items-center gap-x-2.5 rounded-lg p-1"
  >
    <span className="border-lines bg-accent group-active:bg-primary/5 grid size-9 shrink-0 place-content-center rounded-lg border transition duration-150 group-active:scale-90">
      <ArrowLeft className="text-primary size-4.5 opacity-80" strokeWidth={2} />
    </span>
    <span className="grid min-w-0 gap-0.5">
      <span className="text-primary truncate text-sm leading-none font-semibold tracking-tight">
        {title}
      </span>
      <span className="text-primary/55 truncate text-[11px] leading-none">
        {backLabel}
      </span>
    </span>
  </Link>
);

const SchoolLink: FC = () => {
  const translate = useT();

  return (
    <Link
      href={SCHOOL_WEBSITE}
      className="group -m-1 flex items-center gap-x-2.5 rounded-lg p-1"
      aria-label={translate("school.linkAria", { school: SCHOOL_SHORT })}
    >
      <Image
        src={school_logo}
        alt=""
        className="aspect-square w-9 shrink-0 active:scale-95"
      />
      <span className="grid gap-0.5">
        <span className="text-primary text-sm leading-none font-semibold tracking-tight">
          {SCHOOL_SHORT}
        </span>
        <span className="text-primary flex items-center gap-1 text-[11px] leading-none opacity-55">
          <ArrowLeft className="size-3" strokeWidth={2} />
          {translate("school.link")}
        </span>
      </span>
    </Link>
  );
};
