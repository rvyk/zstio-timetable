import { getOptivumList } from "@/actions/getOptivumList";
import {
  MAX_LESSONS,
  REVALIDATE_TIME,
  SHORT_HOURS,
  TIMETABLE_TAG,
} from "@/constants/settings";
import { env } from "@/env";
import { adjustShortenedLessons } from "@/lib/adjustShortenedLessons";
import {
  daySlots,
  filterGroup,
  groupNames,
  isoFromOptivum,
  padHours,
} from "@/lib/apiShape";
import { getTimetable, isTimetableType } from "@/lib/timetableRoute";
import type { OptivumTimetable } from "@/types/optivum";
import type { List, TableHour } from "@majusss/timetable-parser";
import { unstable_cache } from "next/cache";
import { createHash } from "node:crypto";

export const API_VERSION = "1.1.0";

export const CACHE_LONG =
  "public, max-age=60, s-maxage=900, stale-while-revalidate=3600";
export const CACHE_SHORT = "public, max-age=30, s-maxage=60";
export const NO_STORE = "no-store";

export const ok = (request: Request, data: unknown, cache = CACHE_LONG) => {
  const body = JSON.stringify(data);
  const etag = `W/"${createHash("sha1").update(body).digest("base64url")}"`;
  const headers = { "Cache-Control": cache, ETag: etag };

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, {
    headers: { ...headers, "Content-Type": "application/json" },
  });
};

export const fail = (status: number, code: string, message: string) =>
  Response.json(
    { error: { status, code, message } },
    { status, headers: { "Cache-Control": NO_STORE } },
  );

export const sourceUnavailable = () =>
  fail(503, "source_unavailable", "Timetable source is unreachable");

export const TYPES = ["class", "teacher", "room"] as const;

export const LIST_KEY = {
  class: "classes",
  teacher: "teachers",
  room: "rooms",
} as const satisfies Record<OptivumTimetable["type"], keyof List>;

export const appUrl = (path: string) =>
  new URL(path, env.NEXT_PUBLIC_APP_URL).toString();

export const listItems = (list: List, type?: OptivumTimetable["type"]) =>
  TYPES.filter((key) => !type || key === type).flatMap((key) =>
    (list[LIST_KEY[key]] ?? []).map((item) => ({
      type: key,
      id: item.value,
      name: item.name,
      url: appUrl(`/api/v1/timetables/${key}/${item.value}`),
    })),
  );

export const loadList = async () => {
  const list = await getOptivumList();
  const empty = !list.classes.length && !list.teachers?.length;

  return empty ? { error: sourceUnavailable() } : { list };
};

export interface TimetableParams {
  params: Promise<{ type: string; id: string }>;
}

export const MAX_GROUP_LENGTH = 40;

export type LoadedTimetable = OptivumTimetable & { groups: string[] };

export const loadTimetable = async (
  params: TimetableParams["params"],
  request: Request,
): Promise<
  | { error: Response; timetable?: never }
  | { error?: never; timetable: LoadedTimetable }
> => {
  const { type, id } = await params;

  if (!isTimetableType(type)) {
    return {
      error: fail(
        400,
        "invalid_type",
        "Type must be one of: class, teacher, room",
      ),
    };
  }
  if (!/^\d+$/.test(id)) {
    return { error: fail(400, "invalid_id", "Id must be numeric") };
  }

  const group = new URL(request.url).searchParams.get("group")?.trim() ?? null;
  if (group !== null && (!group || group.length > MAX_GROUP_LENGTH)) {
    return {
      error: fail(
        400,
        "invalid_group",
        `group must be 1-${MAX_GROUP_LENGTH} characters`,
      ),
    };
  }

  const { list, error } = await loadList();
  if (error) return { error };

  if (!(list[LIST_KEY[type]] ?? []).some((item) => item.value === id)) {
    return {
      error: fail(404, "not_found", `No ${type} timetable with id ${id}`),
    };
  }

  const timetable = await getTimetable(type, id);
  if (!timetable.title) return { error: sourceUnavailable() };

  return {
    timetable: {
      ...timetable,
      groups: groupNames(timetable.lessons),
      lessons: filterGroup(timetable.lessons, group),
    },
  };
};

const FAN_OUT = 6;

export const schoolGrid = (type: OptivumTimetable["type"]) =>
  unstable_cache(
    async () => {
      const list = await getOptivumList();
      const items = list[LIST_KEY[type]] ?? [];
      let hours: TableHour[] = [];
      let dayNames: string[] = [];

      for (let i = 0; i < items.length; i += FAN_OUT) {
        const batch = await Promise.all(
          items
            .slice(i, i + FAN_OUT)
            .map((item) => getTimetable(type, item.value)),
        );

        for (const timetable of batch) {
          const candidate = Object.values(timetable.hours);
          if (candidate.length > hours.length) hours = candidate;
          if (timetable.dayNames.length > dayNames.length) {
            dayNames = timetable.dayNames;
          }
        }
      }

      if (!hours.length) throw new Error(`No ${type} timetable has hours`);

      return { hours, dayNames };
    },
    ["schoolGrid", type],
    { revalidate: REVALIDATE_TIME, tags: [TIMETABLE_TAG] },
  )().catch((error: unknown) => {
    console.error("Failed to build school grid:", error);
    return null;
  });

export const hoursFor = (
  hours: Record<number, TableHour> | TableHour[],
  searchParams: URLSearchParams,
) => {
  const mode = searchParams.get("hours") ?? "normal";
  const base = Object.values(hours);

  if (mode === "normal") return { hours: padHours(base) };
  if (mode === "short") {
    return { hours: padHours(SHORT_HOURS.slice(0, Math.max(base.length, 1))) };
  }
  if (mode !== "custom") {
    return {
      error: fail(
        400,
        "invalid_hours",
        "hours must be normal, short or custom",
      ),
    };
  }

  const raw = searchParams.get("shortenFrom") ?? "";
  const from = Number(raw);
  if (!/^\d+$/.test(raw) || from < 1 || from > MAX_LESSONS) {
    return {
      error: fail(
        400,
        "invalid_shorten_from",
        `shortenFrom must be an integer between 1 and ${MAX_LESSONS}`,
      ),
    };
  }

  return { hours: padHours(adjustShortenedLessons(from, base)) };
};

export const invalidAt = () =>
  fail(
    400,
    "invalid_at",
    "at must be an ISO 8601 date-time with an offset, or a local Europe/Warsaw YYYY-MM-DD[THH:MM[:SS]]",
  );

export const timetableMeta = (timetable: LoadedTimetable) => {
  const id = timetable.id.substring(1);
  const base = `/api/v1/timetables/${timetable.type}/${id}`;

  return {
    type: timetable.type,
    id,
    code: timetable.id,
    title: timetable.title,
    generatedAt: isoFromOptivum(timetable.generatedDate),
    validFrom: isoFromOptivum(timetable.validDate),
    groups: timetable.groups,
    links: {
      web: appUrl(`/${timetable.type}/${id}`),
      api: appUrl(base),
      calendar: appUrl(`${base}/calendar`),
    },
  };
};

export const shapeDay = (
  timetable: OptivumTimetable,
  hours: TableHour[],
  index: number,
) => ({
  index,
  name: timetable.dayNames[index] ?? null,
  slots: daySlots(hours, timetable.lessons?.[index]),
});
