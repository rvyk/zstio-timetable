import { setLastVisitedCookie } from "@/lib/utils";
import Link from "next/link";
import { AnchorHTMLAttributes, FC } from "react";

export const LinkWithCookie: FC<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
> = ({ href, children, onClick, ...rest }) => {
  const handleClick = (
    link: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    setLastVisitedCookie(link);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={href}
      onClick={(e) => handleClick(href, e)}
      prefetch={false}
      {...rest}
    >
      {children}
    </Link>
  );
};
