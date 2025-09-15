import { env } from "@/env";

export type DataSource = {
  name: string;
  url: string;
};

export const DATA_SOURCE_COOKIE_NAME = "selectedDataSource";

const sanitizeUrl = (candidate?: string | null): string | null => {
  if (!candidate) return null;
  const trimmedCandidate = candidate.trim();
  if (!trimmedCandidate) return null;

  try {
    const parsed = new URL(trimmedCandidate);

    if (![`http:`, `https:`].includes(parsed.protocol)) {
      return null;
    }

    parsed.hash = "";

    const normalized = parsed.toString().replace(/\/+$/, "");
    return normalized;
  } catch {
    return null;
  }
};

export const normalizeDataSourceUrl = (candidate: string): string | null => {
  return sanitizeUrl(candidate);
};

const extractNameFromEntry = (
  entry: string,
  defaultUrl: string | null,
): DataSource | null => {
  const [maybeName, maybeUrl] = entry
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const urlCandidate = maybeUrl || maybeName;
  if (!urlCandidate) {
    return null;
  }

  const normalizedUrl = sanitizeUrl(urlCandidate);
  if (!normalizedUrl) {
    return null;
  }

  const isDefault = defaultUrl !== null && normalizedUrl === defaultUrl;
  const resolvedName = maybeUrl && maybeName
    ? maybeName
    : isDefault
      ? "Główny Plan lekcji"
      : prettyNameFromUrl(normalizedUrl);

  return {
    name: resolvedName,
    url: normalizedUrl,
  };
};

export const parseEnvDataSources = (): DataSource[] => {
  const defaultUrl = sanitizeUrl(env.NEXT_PUBLIC_TIMETABLE_URL ?? null);
  const rawList =
    env.NEXT_PUBLIC_TIMETABLES_URL ?? env.NEXT_PUBLIC_TIMETABLE_URL ?? "";

  const entries = rawList
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const sources: DataSource[] = [];

  if (defaultUrl) {
    sources.push({
      name: "Główny Plan lekcji",
      url: defaultUrl,
    });
  }

  for (const entry of entries) {
    const parsedEntry = extractNameFromEntry(entry, defaultUrl);
    if (!parsedEntry) continue;

    const alreadyPresent = sources.some(
      (source) => source.url === parsedEntry.url,
    );
    if (alreadyPresent) continue;

    sources.push(parsedEntry);
  }

  return sources;
};

export const prettyNameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const [firstSegment] = parsed.pathname.split("/").filter(Boolean);
    return firstSegment ? `${host}/${firstSegment}` : host;
  } catch {
    return url;
  }
};

export const joinDataSourcePath = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return `${normalizedBase}/${normalizedPath}`;
};

export const isOriginalDataSource = (url: string): boolean => {
  const defaultUrl = sanitizeUrl(env.NEXT_PUBLIC_TIMETABLE_URL ?? null);
  const normalizedCandidate = sanitizeUrl(url);

  return Boolean(
    defaultUrl && normalizedCandidate && defaultUrl === normalizedCandidate,
  );
};
