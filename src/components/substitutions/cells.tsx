"use client";

import { FC } from "react";

interface TableHourCellProps {
  number: number;
  timeRange: string;
}

export const LessonHourCell: FC<TableHourCellProps> = ({
  number,
  timeRange,
}) => {
  return (
    <td className="relative flex h-full min-h-16 w-full flex-col items-center justify-center py-3">
      <h2 className="text-xl font-semibold text-primary/90">{number}</h2>
      <div className="grid gap-2">
        <p className="text-sm font-medium text-primary/70">{timeRange}</p>
      </div>
    </td>
  );
};
