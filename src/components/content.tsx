import Substitutions from "@/components/content-items/substitutions/substitutions";
import TimeTable from "@/components/content-items/timetable/timetable";
import { Table as TableType } from "@/types/timetable";
import { List } from "@wulkanowy/timetable-parser";
import { usePathname } from "next/navigation";
import React from "react";

interface ContentProps {
  substitutions: TableType["substitutions"];
  timeTable: TableType["timeTable"];
  timeTableList: List;
}

const Content: React.FC<ContentProps> = ({
  substitutions,
  timeTable,
  timeTableList,
}) => {
  const pathname = usePathname();
  const isIndex = pathname === "/";
  const isSubstitution = pathname === "/zastepstwa";

  if (isIndex) return null;

  // if (!isReady) return <SkeletonLoading {...{ isSubstitution }} />;

  if (isSubstitution) {
    return <Substitutions {...{ substitutions }} />;
  }

  return <TimeTable {...{ timeTable, substitutions, timeTableList }} />;
};

export default Content;
