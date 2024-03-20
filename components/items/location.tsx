"use client";

import { TimetableContext } from "@/components/providers/timetable-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export function Location({ className }: { className?: string }) {
  const table = useContext(TimetableContext);
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem className="font-medium capitalize last:font-bold last:text-foreground">
          <BreadcrumbLink href={``}>{usePathname().split("/").filter(Boolean)[0]}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="font-medium capitalize last:font-bold last:text-foreground">
          <BreadcrumbLink href={``}> {table?.title /*.split(' ')[0];*/}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
