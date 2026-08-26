import { setLastVisitedCookie } from "@/lib/utils";
import Link from "next/link";
import { AnchorHTMLAttributes, FC } from "react";

export const LinkWithCookie: FC<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
> = ({ href, children, onClick, ...rest }) => {
  return (
    <Link
      href={href}
      onClick={(event) => {
        setLastVisitedCookie(href);
        onClick?.(event);
      }}
      prefetch={false}
      {...rest}
    >
      {children}
    </Link>
  );
};
