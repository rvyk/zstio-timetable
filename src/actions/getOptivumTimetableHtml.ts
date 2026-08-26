"use server";

import { REVALIDATE_TIME } from "@/constants/settings";
import { getTimetableBaseUrl, joinDataSourcePath } from "@/lib/dataSource";

export const getOptivumTimetableHtml = async (
  timetableId: string,
): Promise<string | null> => {
  const baseUrl = getTimetableBaseUrl();
  if (!baseUrl || !/^[nos]\d+$/.test(timetableId)) return null;

  const url = joinDataSourcePath(baseUrl, `plany/${timetableId}.html`);

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const base = `<base href="${url}">`;

    return html.includes("<head")
      ? html.replace(/<head[^>]*>/i, (match) => `${match}${base}`)
      : `${base}${html}`;
  } catch (error) {
    console.error("Failed to fetch Optivum timetable HTML:", error);
    return null;
  }
};
