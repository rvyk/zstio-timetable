import Substitutions from "@/components/content-items/substitutions/substitutions";
import Timetable from "@/components/content-items/timetable/timetable";
import { Table as TableType } from "@/types/timetable";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface ContentProps {
  substitutions: TableType["substitutions"];
  timeTable: TableType["timeTable"];
}

const Content: React.FC<ContentProps> = ({ substitutions, timeTable }) => {
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
};

export default Content;
