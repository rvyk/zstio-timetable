"use client";

import { parseEnvDataSources } from "@/lib/dataSource";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataSourceState {
  selectedDataSource: string;
  availableDataSources: { name: string; url: string }[];
  isLoading: boolean;
  setSelectedDataSource: (url: string) => void;
  setAvailableDataSources: (list: { name: string; url: string }[]) => void;
}

export const useDataSourceStore = create<DataSourceState>()(
  persist(
    (set) => ({
      selectedDataSource: "",
      availableDataSources: [],
      isLoading: false,
      setSelectedDataSource: (url) => set({ selectedDataSource: url }),
      setAvailableDataSources: (list) => set({ availableDataSources: list }),
    }),
    { name: "timetable-data-source" },
  ),
);

const getCookieSelected = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )selectedDataSource=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const initDataSources = () => {
  const sources = parseEnvDataSources();
  const cookieSel = getCookieSelected();

  const current = useDataSourceStore.getState();

  useDataSourceStore.setState({ availableDataSources: sources });

  const fallback = sources[0]?.url || "";
  const nextSelected =
    cookieSel && sources.some((s) => s.url === cookieSel)
      ? cookieSel
      : current.selectedDataSource || fallback;

  if (nextSelected && current.selectedDataSource !== nextSelected) {
    useDataSourceStore.setState({ selectedDataSource: nextSelected });
  }
};
