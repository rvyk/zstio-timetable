"use client";

import { useT } from "@/components/common/LocaleProvider";
import { env } from "@/env";
import { useAltTimetable } from "@/hooks/useAltTimetable";
import { getTimetableBaseUrl } from "@/lib/dataSource";
import { FC, Fragment } from "react";

export const OtherTimetables: FC = () => {
  const translate = useT();
  const hasAltTimetable = useAltTimetable();

  const links = [
    {
      href: getTimetableBaseUrl(),
      label: translate("settings.sourceTimetable"),
    },
    {
      href: hasAltTimetable ? env.NEXT_PUBLIC_ALT_TIMETABLE_URL : undefined,
      label: translate("settings.altTimetable"),
    },
  ].filter((link) => link.href);

  if (links.length === 0) return null;

  return (
    <p className="text-primary/55 text-[11px]">
      {translate("settings.otherTimetables")}{" "}
      {links.map(({ href, label }, index) => (
        <Fragment key={label}>
          {index > 0 && ", "}
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="text-primary/72 hover:text-primary whitespace-nowrap underline underline-offset-2 transition-colors"
          >
            {label}
          </a>
        </Fragment>
      ))}
    </p>
  );
};
