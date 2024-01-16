"use client";

import { cn } from "@/lib/utils";

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  isSubstitutions?: boolean;
}

const ListLargeItem: React.FC<ListItemProps> = (
  { children, className, isSubstitutions },
) => {
  return (
    <div
      className={cn(
        "flex min-h-[4rem] w-full flex-col justify-center px-5 py-2",
        isSubstitutions &&
          "flex w-52 flex-col justify-center whitespace-nowrap px-6 py-4 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ListSmallItem: React.FC<ListItemProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "my-2 flex w-24 flex-shrink-0 flex-col justify-center rounded-l py-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface ListRowProps {
  children: React.ReactNode;
  reverseColor?: boolean;
  className?: string;
}

const ListRow: React.FC<ListRowProps> = (
  { children, reverseColor, className },
) => {
  return (
    <div
      className={cn(
        "text-gray-600",
        reverseColor
          ? "bg-white dark:bg-[#202020]"
          : "bg-zinc-50 dark:bg-[#262626]",
        "mx-1.5 my-1 flex rounded-lg border-zinc-100 shadow-sm first:mt-0 dark:text-gray-300",
        className,
      )}
    >
      {children}
    </div>
  );
};

export { ListLargeItem, ListRow, ListSmallItem };
