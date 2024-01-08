"use client";

import { cn, days } from "@/lib/utils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cva } from "class-variance-authority";

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => (
  <div className="w-full relative mb-8 flex justify-center">
    <div className="overflow-x-auto shadow-md md:rounded-xl w-[90%]">
      <table className="w-full text-sm text-left transition-all duration-200 text-gray-500 dark:text-gray-300">
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
      <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-gray-300 dark:bg-[#202020]">
        <p className="transition-all text-lg font-normal text-gray-500 lg:text-xl mr-1 dark:text-gray-400">
          {isSubstitutions
            ? "Brak zastępstw"
            : "Nie znaleziono pasującego planu lekcji"}
        </p>
      </caption>
    );
  }

  if (isLoading) {
    return (
      <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-gray-300 dark:bg-[#202020]">
        <div
          role="status"
          className="transition-all lg:text-xl w-full flex items-center"
        >
          <ArrowPathIcon className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-300 fill-[#2B161B] dark:fill-[#171717]" />
        </div>
      </caption>
    );
  }

  return (
    <caption className="p-5 transition-all text-lg font-semibold text-left text-gray-900 bg-white dark:text-gray-300 dark:bg-[#202020]">
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
    <thead className="text-xs transition-all duration-200 text-[#ffffff] bg-[#2B161B] uppercase dark:bg-[#151515] dark:text-gray-300">
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
      className={`text-gray-600 dark:text-gray-300 border-b ${
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
