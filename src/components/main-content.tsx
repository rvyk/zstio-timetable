"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SkeletonLoading from "./content-items/skeleton-loading";
import Substitutions from "./content-items/substitutions/substitutions";
import TimeTable from "./content-items/timetable/timetable";

const Content = () => {
  const pathname = usePathname();
  const isIndex = pathname === "/";
  const isSubstitutions = pathname === "/zastepstwa";

  if (isIndex) return <SkeletonLoading />;
  if (isSubstitutions)
    return (
      <Suspense>
        <Substitutions />
      </Suspense>
    );
  return <TimeTable />;
};

export default Content;
