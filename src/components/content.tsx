import SkeletonLoading from "@/components/content-items/skeleton-loading";
import Substitutions from "@/components/content-items/substitutions/substitutions";
import TimeTable from "@/components/content-items/timetable/timetable";
import { Table as TableType } from "@/types/timetable";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

interface ContentProps {
  substitutions: TableType["substitutions"];
  timeTable: TableType["timeTable"];
}

const Content: React.FC<ContentProps> = ({ substitutions, timeTable }) => {
  const pathname = usePathname();
  const isIndex = pathname === "/";
  const isSubstitution = pathname === "/zastepstwa";
  const { isReady } = useRouter();

  if (isIndex) return null;

  if (!isReady) return <SkeletonLoading isSubstitution={isSubstitution} />;

  if (isSubstitution) {
    return <Substitutions substitutions={substitutions} />;
  }

  if (timeTable.status) {
    return <TimeTable {...{ timeTable, substitutions }} />;
  }
};

export default Content;
