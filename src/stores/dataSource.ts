"use client";

import {
  DATA_SOURCE_COOKIE_NAME,
  DataSource,
  normalizeDataSourceUrl,
  parseEnvDataSources,
} from "@/lib/dataSource";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataSourceState {
  selectedDataSource: string;
  availableDataSources: DataSource[];
  setSelectedDataSource: (url: string) => void;
  setAvailableDataSources: (list: DataSource[]) => void;
}

export const useDataSourceStore = create<DataSourceState>()(
  persist(
    (set) => ({
      selectedDataSource: "",
      availableDataSources: [],
      setSelectedDataSource: (url) => {
        const normalized = normalizeDataSourceUrl(url);
        if (normalized) {
          set({ selectedDataSource: normalized });
        }
      },
      setAvailableDataSources: (list) => set({ availableDataSources: list }),
    }),
    { name: "timetable-data-source" },
  ),
);

const getCookieSelected = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${DATA_SOURCE_COOKIE_NAME}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
};

export const initDataSources = () => {
  const sources = parseEnvDataSources();
  const cookieSel = normalizeDataSourceUrl(getCookieSelected() ?? "");

  const current = useDataSourceStore.getState();

  useDataSourceStore.setState({ availableDataSources: sources });

  const fallback = sources[0]?.url || "";
  let nextSelected = current.selectedDataSource || fallback;

  if (cookieSel && sources.some((s) => s.url === cookieSel)) {
    nextSelected = cookieSel;
  }

  if (nextSelected && current.selectedDataSource !== nextSelected) {
    useDataSourceStore.setState({ selectedDataSource: nextSelected });
  }
};
