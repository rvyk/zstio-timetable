"use client";

import { prettyNameFromUrl, isOriginalDataSource } from "@/lib/dataSource";
import { cn } from "@/lib/utils";
import { useDataSourceStore } from "@/stores/dataSource";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

export const DataSourceBanner = () => {
  const { selectedDataSource, availableDataSources } = useDataSourceStore();

  const isOriginalSource = isOriginalDataSource(selectedDataSource);

  const selectedSourceName = useMemo(() => {
    if (!selectedDataSource) return null;

    const matchingSource = availableDataSources.find(
      (source) => source.url === selectedDataSource,
    );

    if (matchingSource) {
      return matchingSource.name;
    }

    return prettyNameFromUrl(selectedDataSource);
  }, [availableDataSources, selectedDataSource]);

  if (!selectedDataSource || isOriginalSource) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 shadow-sm",
        "text-primary/80",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary/70">
          <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="grid gap-1 text-sm leading-relaxed">
          <p className="font-semibold text-primary/90">
            Korzystasz z alternatywnego źródła danych planu lekcji.
          </p>
          <p className="text-primary/70">
            Plan został wczytany z „{selectedSourceName ?? selectedDataSource}”.
            Dane mogą różnić się od głównego źródła. Jeśli to pomyłka, wybierz
            ponownie Główny Plan lekcji w menu źródeł danych.
          </p>
        </div>
      </div>
    </div>
  );
};
