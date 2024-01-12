"use client";

import { cn, days } from "@/lib/utils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cva } from "class-variance-authority";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className={cn("relative mb-8 w-full", className)}>
    <div className="w-full overflow-x-auto shadow-md md:w-[90%] md:rounded-xl">
      <table className="w-full text-left text-sm text-gray-500 transition-all duration-200 dark:text-gray-300">
        {children}
      </table>
    </div>
  </div>
);

interface TableCaptionProps {
  status: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  isSubstitutions?: boolean;
  className?: string;
}

const TableCaption: React.FC<TableCaptionProps> = ({
  status,
  isLoading,
  children,
  isSubstitutions,
  className,
}) => {
  if (!status) {
    return (
      <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 transition-all dark:bg-[#202020] dark:text-gray-300">
        <p className="mr-1 text-lg font-normal text-gray-500 transition-all dark:text-gray-400 lg:text-xl">
          {isSubstitutions
            ? "Brak zastępstw"
            : "Nie znaleziono pasującego planu lekcji"}
        </p>
      </caption>
    );
  }

  if (isLoading) {
    return (
      <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 transition-all dark:bg-[#202020] dark:text-gray-300">
        <div
          role="status"
          className="flex w-full items-center transition-all lg:text-xl"
        >
          <ArrowPathIcon className="h-7 w-7 animate-spin fill-[#2B161B] text-gray-200 dark:fill-[#171717] dark:text-gray-300" />
        </div>
      </caption>
    );
  }

  return (
    <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 transition-all dark:bg-[#202020] dark:text-gray-300">
      <div className={cn("flex items-center", className)}>{children}</div>
    </caption>
  );
};

interface TableHeaderProps {
  isSubstitutions?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ isSubstitutions }) => {
  const items = [
    "Lekcja",
    "Nauczyciel",
    "Oddział",
    "Przedmiot",
    "Sala",
    "Zastępca",
    "Uwagi",
  ];

  return (
    <thead className="bg-[#2B161B] text-xs uppercase text-[#ffffff] transition-all duration-200 dark:bg-[#151515] dark:text-gray-300">
      <tr>
        {isSubstitutions ? (
          items.map((item) => (
            <th scope="col" className="px-6 py-3" key={item}>
              <div className="flex items-center justify-center">{item}</div>
            </th>
          ))
        ) : (
          <>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center justify-center">Lekcja</div>
            </th>
            <th scope="col" className="px-8 py-3">
              <div className="flex items-center justify-center">Godz.</div>
            </th>
            {days.map((day) => (
              <th scope="col" className="px-6 py-3" key={day.long}>
                <div className="flex items-center justify-center">
                  {day.long}
                </div>
              </th>
            ))}
          </>
        )}
      </tr>
    </thead>
  );
};

interface TableRowProps {
  reverseColor?: boolean;
  children?: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ reverseColor, children }) => {
  return (
    <tr
      className={`border-b text-gray-600 dark:text-gray-300 ${
        reverseColor
          ? "bg-white dark:bg-[#191919]"
          : "bg-gray-50 dark:bg-[#202020]"
      } dark:border-[#181818] `}
    >
      {children}
    </tr>
  );
};

const tableCellVariants = cva(
  "border-r last:border-none dark:border-[#171717]",
  {
    variants: {
      variant: {
        number: "py-4 text-center h-full font-semibold",
        time: "text-center",
        normal: "px-6 py-4 whitespace-nowrap text-ellipsis overflow-hidden",
        substitutionNumber:
          "py-4 px-4 whitespace-nowrap text-center h-full border-r last:border-none font-semibold dark:border-[#171717]",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

interface TableCellProps {
  className?: string;
  variant?: "number" | "time" | "normal" | "substitutionNumber";
  children?: React.ReactNode;
  colSpan?: number;
  scope?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  className,
  variant,
  children,
  colSpan,
  scope,
}) => {
  return (
    <td
      colSpan={colSpan}
      scope={scope}
      className={cn(tableCellVariants({ variant, className }))}
    >
      {children}
    </td>
  );
};

interface TableFooterProps {
  children?: React.ReactNode;
}

const TableFooter: React.FC<TableFooterProps> = ({ children }) => {
  return <tfoot>{children}</tfoot>;
};

export { Table, TableCaption, TableCell, TableFooter, TableHeader, TableRow };
