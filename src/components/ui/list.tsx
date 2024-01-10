"use client";

import { cn } from "@/lib/utils";

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

const ListLargeItem: React.FC<ListItemProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "w-full px-5 py-2 min-h-[4rem] flex flex-col justify-center",
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
        "w-24 rounded-l py-1 my-2 flex-shrink-0 flex flex-col justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface ListRowProps {
  children: React.ReactNode;
  isReverse?: boolean;
  className?: string;
}

const ListRow: React.FC<ListRowProps> = ({
  children,
  isReverse,
  className,
}) => {
  return (
    <div
      className={cn(
        "text-gray-600",
        isReverse
          ? "bg-white dark:bg-[#202020]"
          : "bg-zinc-50 dark:bg-[#262626]",
        "dark:text-gray-300 flex shadow-sm border-zinc-100 m-1.5 first:mt-0 rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  );
};

export { ListLargeItem, ListRow, ListSmallItem };
