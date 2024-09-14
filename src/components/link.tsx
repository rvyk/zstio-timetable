import { setCookie } from "cookies-next";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export const LinkWithCookie: React.FC<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
> = ({ href, children, ...rest }) => {
  const handleClick = (link: string) => {
    setCookie("lastVisited", link, {
      path: "/",
    });
  };

  return (
    <Link href={href} onClick={() => handleClick(href)} {...rest}>
      {children}
    </Link>
  );
};