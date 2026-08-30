"use client";

import { RefObject, useLayoutEffect, useRef, useState } from "react";

export const useFillerRows = (
  tableRef: RefObject<HTMLTableElement | null>,
  containerSelector: string,
  pad: number,
  deps: unknown[],
) => {
  const fillerRef = useRef({ count: 0, height: 0 });
  const [filler, setFiller] = useState({ count: 0, height: 0 });

  useLayoutEffect(() => {
    const table = tableRef.current;
    const container = table?.closest(containerSelector);
    if (!table || !container) return;

    const measure = () => {
      const rows = table.querySelectorAll<HTMLTableRowElement>("tr[data-hour]");
      const rowHeight = rows[rows.length - 1]?.offsetHeight ?? 0;
      if (!rowHeight) return;

      const { count, height } = fillerRef.current;
      const filled = table.offsetHeight - count * height;
      const free = container.clientHeight - filled - pad;
      const next = Math.max(0, Math.floor(free / rowHeight));

      if (next !== count || rowHeight !== height) {
        fillerRef.current = { count: next, height: rowHeight };
        setFiller(fillerRef.current);
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(table);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRef, containerSelector, pad, ...deps]);

  return filler;
};
