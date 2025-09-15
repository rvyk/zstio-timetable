import { env } from "@/env";

export type DataSource = {
  name: string;
  url: string;
};

export const parseEnvDataSources = (): DataSource[] => {
  const list =
    env.NEXT_PUBLIC_TIMETABLES_URL ?? env.NEXT_PUBLIC_TIMETABLE_URL ?? "";
  const parts = list
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const defaultUrl = env.NEXT_PUBLIC_TIMETABLE_URL;
  if (defaultUrl && !parts.includes(defaultUrl)) parts.unshift(defaultUrl);

  const unique = Array.from(new Set(parts));
  return unique.map((url, index) => ({
    name:
      index === 0 && url === defaultUrl
        ? "Główny Plan lekcji"
        : prettyNameFromUrl(url),
    url,
  }));
};

export const prettyNameFromUrl = (url: string) => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const seg = u.pathname.split("/").filter(Boolean)[0];
    return seg ? `${host}/${seg}` : host;
  } catch {
    return url;
  }
};

export const isOriginalDataSource = (url: string): boolean => {
  const defaultUrl = env.NEXT_PUBLIC_TIMETABLE_URL;
  return defaultUrl === url;
};
