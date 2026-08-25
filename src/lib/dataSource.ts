import { env } from "@/env";

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

    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
};

export const getTimetableBaseUrl = (): string =>
  sanitizeUrl(env.NEXT_PUBLIC_TIMETABLE_URL ?? null) ?? "";

export const joinDataSourcePath = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return `${normalizedBase}/${normalizedPath}`;
};
