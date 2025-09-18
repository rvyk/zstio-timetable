"use client";

import { isOriginalDataSource, prettyNameFromUrl } from "@/lib/dataSource";
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
        "border-primary/10 bg-primary/5 w-full rounded-b-xl border px-4 py-3 md:rounded-xl",
        "text-primary/80",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="bg-accent-table text-accent/90 dark:text-primary/90 grid h-10 w-10 shrink-0 place-items-center rounded-full">
          <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="grid leading-relaxed">
          <p className="text-primary/90 text-sm font-semibold sm:text-base">
            Korzystasz z alternatywnego źródła planu lekcji.
          </p>
          <p className="text-primary/70 text-xs sm:text-sm">
            Aktualne dane pochodzą z „{selectedSourceName ?? selectedDataSource}
            ”. Wybierz Główny Plan lekcji, aby wrócić do standardowego źródła.
          </p>
        </div>
      </div>
    </div>
  );
};
