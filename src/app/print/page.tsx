"use client";

import { getOptivumTimetableHtml } from "@/actions/getOptivumTimetableHtml";
import { useT } from "@/components/common/LocaleProvider";
import { useTimetableStore } from "@/stores/timetable";
import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";

export default function PrintPage() {
  const translate = useT();
  const { timetable } = useTimetableStore();
  const isMounted = useIsClient();
  const [html, setHtml] = useState<string | null>();

  useEffect(() => {
    if (!isMounted || !timetable?.id) return;
    void getOptivumTimetableHtml(timetable.id).then(setHtml);
  }, [isMounted, timetable?.id]);

  if (!isMounted) return null;

  if (html === undefined && timetable?.id) return null;

  if (!timetable?.id || html === null) {
    return <p className="p-8 text-black">{translate("print.noData")}</p>;
  }

  return (
    <iframe
      title={timetable.title}
      srcDoc={html}
      className="h-screen w-full border-0 bg-white"
      onLoad={(event) => event.currentTarget.contentWindow?.print()}
    />
  );
}
