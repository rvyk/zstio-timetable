"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function Location({ className }: { className?: string }) {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {usePathname()
                    .split("/")
                    .filter(Boolean)
                    .map((path, index, paths) => (
                        <Fragment key={path}>
                            <BreadcrumbItem className="font-medium capitalize last:font-bold last:text-foreground">
                                <BreadcrumbLink href={`/${paths.slice(0, index + 1).join("/")}`}>{path}</BreadcrumbLink>
                            </BreadcrumbItem>
                            {index !== paths.length - 1 && <BreadcrumbSeparator />}
                        </Fragment>
                    ))}
                {usePathname() === "/" && (
                    <span className="ml-2 font-bold text-yellow-400">
                        ścieka / - nie powinno nas tu być - ogarnijcie tą logikę by ustawiało defaultowo lub z ostatniej
                        w localstorage
                    </span>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
