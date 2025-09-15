"use server";

import { env } from "@/env";
import { normalizeDataSourceUrl, parseEnvDataSources } from "@/lib/dataSource";

export const getActiveDataSource = async (
  requestedSource?: string,
): Promise<string> => {
  const sanitizedRequest =
    requestedSource && requestedSource !== "default"
      ? normalizeDataSourceUrl(requestedSource)
      : null;

  const sources = parseEnvDataSources();

  if (sanitizedRequest) {
    const matchedSource = sources.find((source) => source.url === sanitizedRequest);
    if (matchedSource) {
      return matchedSource.url;
    }
  }

  if (sources.length > 0) {
    return sources[0].url;
  }

  return (
    normalizeDataSourceUrl(env.NEXT_PUBLIC_TIMETABLE_URL ?? "") ??
    sanitizedRequest ??
    ""
  );
};
