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
          <BreadcrumbLink href={``}> {table?.title}</BreadcrumbLink>
        </BreadcrumbItem>

        {usePathname() === "/" && (
          <span className="ml-2 font-bold text-yellow-400">
            ścieka / - nie powinno nas tu być - ogarnijcie tą logikę by ustawiało defaultowo lub z ostatniej w
            localstorage
          </span>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
