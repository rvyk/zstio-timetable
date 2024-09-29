import { setCookie } from "cookies-next";
import Link from "next/link";
import { AnchorHTMLAttributes, FC } from "react";

export const LinkWithCookie: FC<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
> = ({ href, children, onClick, ...rest }) => {
  const handleClick = (
    link: string,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    setCookie("lastVisited", link, {
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={(e) => handleClick(href, e)} {...rest}>
      {children}
    </Link>
  );
};
