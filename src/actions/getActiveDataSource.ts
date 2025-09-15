"use server";

import { env } from "@/env";
import { parseEnvDataSources } from "@/lib/dataSource";

export const getActiveDataSource = async (
  dataSource: string = "default",
): Promise<string> => {
  const sources = parseEnvDataSources();
  const urls = new Set(sources.map((s) => s.url));

  if (dataSource && urls.has(dataSource)) return dataSource;

  if (sources.length > 0) {
    return sources[0].url;
  }

  return env.NEXT_PUBLIC_TIMETABLE_URL ?? "";
};
