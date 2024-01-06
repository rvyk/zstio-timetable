import Timetable from "@/components/content-items/timetable/timetable";
import { Table as TableType } from "@/types/timetable";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import Substitutions from "./content-items/substitutions/substitutions";

function Content({ substitutions, timeTable }: TableType) {
  const [isShortHours, setIsShortHours] = useState(false);

  const pathname = usePathname();
  const isIndex = pathname === "/";
  const isSubstitution = pathname === "/zastepstwa";
  const { isReady } = useRouter();

  if (!isReady || isIndex) return null;

  if (isSubstitution) {
    return <Substitutions substitutions={substitutions} />;
  }

  if (timeTable.status) {
    return (
      <Timetable
        timeTable={timeTable}
        substitutions={substitutions}
        isShortHours={isShortHours}
      />
    );
  }
}

export default Content;
