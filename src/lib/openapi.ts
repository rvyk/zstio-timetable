import { SCHOOL_NAME } from "@/constants/school";
import { MAX_LESSONS } from "@/constants/settings";
import { API_VERSION, appUrl, MAX_GROUP_LENGTH } from "@/lib/api";
import { NEXT_LESSON_HORIZON_DAYS } from "@/lib/apiShape";

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const param = (name: string) => ({ $ref: `#/components/parameters/${name}` });
const error = (name: string) => ({ $ref: `#/components/responses/${name}` });

const json = (schema: object, description = "OK") => ({
  description,
  content: { "application/json": { schema } },
});

const ok = (schema: object) => ({
  description: "OK",
  headers: { ETag: { $ref: "#/components/headers/ETag" } },
  content: { "application/json": { schema } },
});

const notModified = { description: "Not modified (matching If-None-Match)" };

const object = (
  properties: Record<string, object>,
  required = Object.keys(properties),
) => ({ type: "object", additionalProperties: false, required, properties });

const nullable = (schema: object) => ({ anyOf: [schema, { type: "null" }] });

const string = { type: "string" };
const integer = { type: "integer" };
const boolean = { type: "boolean" };
const date = { type: "string", format: "date" };
const dateTime = { type: "string", format: "date-time" };
const uri = { type: "string", format: "uri" };
const time = {
  type: "string",
  pattern: "^\\d{2}:\\d{2}$",
  examples: ["08:00"],
};

const ERROR_CODES = [
  "invalid_type",
  "invalid_id",
  "invalid_group",
  "invalid_day",
  "invalid_hours",
  "invalid_shorten_from",
  "invalid_at",
  "invalid_from",
  "invalid_weeks",
  "invalid_weekends",
  "invalid_lesson",
  "invalid_limit",
  "missing_query",
  "not_found",
  "unknown_endpoint",
  "calendar_error",
  "source_unavailable",
  "news_unavailable",
];

const timetablePath = "/api/v1/timetables/{type}/{id}";
const timetableParams = [param("Type"), param("Id"), param("Group")];
const hoursParams = [param("Hours"), param("ShortenFrom")];
const timetableErrors = {
  304: notModified,
  400: error("BadRequest"),
  404: error("NotFound"),
  503: error("SourceUnavailable"),
};
const atParam = {
  name: "at",
  in: "query",
  description:
    "Evaluate at this moment instead of now. Either ISO 8601 with an offset (`2026-11-16T09:10:00+01:00`, `…Z`) or a local Europe/Warsaw `YYYY-MM-DD` / `YYYY-MM-DDTHH:MM[:SS]`.",
  schema: string,
  example: "2026-11-16T09:10",
};
const dayParam = {
  name: "day",
  description:
    "`0`-`6` (Monday first), `monday`…`sunday`, `today` or `tomorrow`",
  schema: string,
};

const get = (
  operationId: string,
  tags: string[],
  summary: string,
  description: string,
  parameters: object[],
  responses: object,
) => ({
  get: { tags, summary, description, operationId, parameters, responses },
});

const loose = (properties: Record<string, object>) => ({
  type: "object",
  required: Object.keys(properties),
  properties,
});

const withMeta = (properties: Record<string, object>) => ({
  allOf: [ref("TimetableMeta"), loose(properties)],
  unevaluatedProperties: false,
});

export const openApiSpec = () => ({
  openapi: "3.1.0",
  info: {
    title: "ZSTiO Timetable API",
    version: API_VERSION,
    description: [
      `Public, read-only JSON API for the timetable of ${SCHOOL_NAME}.`,
      "",
      "Data is scraped from the school's Optivum (UONET) timetable. Upstream pages are cached for 15 minutes; responses carry `Cache-Control` (browsers 60 s, shared caches 15 min, date-relative answers 1 min, live ones `no-store`) and a weak `ETag`, so polling with `If-None-Match` returns `304`. No API key is needed and CORS is open to every origin.",
      "",
      "**Conventions**",
      "- A timetable is addressed by `type` (`class`, `teacher`, `room`) and its numeric Optivum `id`. Get both from `/api/v1/timetables` or `/api/v1/search`.",
      "- Days are 0-indexed starting on Monday (`0` = Monday … `4` = Friday). `day` values also accept English weekday names, `today` and `tomorrow`, evaluated in Europe/Warsaw.",
      "- Times are local Europe/Warsaw `HH:MM`, dates `YYYY-MM-DD`, instants ISO 8601 UTC.",
      "- A slot is one lesson period. `entries` lists everything taught in it; split groups produce several entries, a free period an empty array.",
      "- `group` narrows a timetable to one group (e.g. `1/2`) and keeps whole-class lessons. The groups a timetable has are listed in `groups`.",
      "- Bell times differ per timetable only in length: `/hours` returns the longest schedule in the school.",
      '- Errors always come back as `{ "error": { "status", "code", "message" } }`, also for unknown paths under `/api/v1`.',
      "",
      "**Versioning**: additive changes (new endpoints, new fields) bump the minor version reported in `X-API-Version`. Removing or renaming fields would ship as `/api/v2`.",
    ].join("\n"),
    license: { name: "MIT" },
  },
  servers: [{ url: new URL(appUrl("/")).origin }],
  tags: [
    {
      name: "Timetables",
      description: "Lists and timetables of classes, teachers and rooms",
    },
    {
      name: "School",
      description:
        "School-wide data: bell schedule, free rooms, days off, news, plan changes",
    },
    { name: "Meta", description: "API status and description" },
  ],
  paths: {
    "/api/v1": get(
      "getIndex",
      ["Meta"],
      "API index",
      "Version, documentation links and every endpoint.",
      [],
      {
        200: ok(ref("Index")),
      },
    ),
    "/api/v1/status": get(
      "getStatus",
      ["Meta"],
      "Health and data freshness",
      "Checks the upstream timetable source. Returns `503` with the same body when it cannot be reached.",
      [],
      {
        200: json(ref("Status")),
        503: json(ref("Status"), "Source unavailable"),
      },
    ),
    "/api/v1/openapi.json": get(
      "getOpenApi",
      ["Meta"],
      "OpenAPI document",
      "This document. The interactive reference lives at `/api/v1/docs`.",
      [],
      { 200: ok({ type: "object", description: "OpenAPI 3.1 document" }) },
    ),
    "/api/v1/timetables": get(
      "listTimetables",
      ["Timetables"],
      "List timetables",
      "Every class, teacher and room that has a timetable. Filter by type or by a case- and diacritic-insensitive name fragment.",
      [
        { name: "type", in: "query", schema: ref("TimetableType") },
        {
          name: "q",
          in: "query",
          description: "Name fragment, e.g. `4tp`",
          schema: string,
        },
      ],
      {
        200: ok(ref("TimetableList")),
        304: notModified,
        400: error("BadRequest"),
        503: error("SourceUnavailable"),
      },
    ),
    "/api/v1/search": get(
      "searchTimetables",
      ["Timetables"],
      "Search timetables",
      "Ranked search across classes, teachers and rooms: exact matches first, then prefixes, then substrings.",
      [
        {
          name: "q",
          in: "query",
          required: true,
          schema: string,
          example: "4tp",
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
        },
      ],
      {
        200: ok(ref("SearchResult")),
        304: notModified,
        400: error("BadRequest"),
        503: error("SourceUnavailable"),
      },
    ),
    [timetablePath]: get(
      "getTimetable",
      ["Timetables"],
      "Get a timetable",
      "The whole week: bell schedule plus every day with its slots.",
      [...timetableParams, ...hoursParams],
      {
        200: ok(
          withMeta({
            hours: { type: "array", items: ref("Hour") },
            days: { type: "array", items: ref("Day") },
          }),
        ),
        ...timetableErrors,
      },
    ),
    [`${timetablePath}/days/{day}`]: get(
      "getTimetableDay",
      ["Timetables"],
      "Get one day",
      "Slots of a single weekday. Days the timetable does not cover (usually weekends) come back with `name: null` and no slots.",
      [
        ...timetableParams,
        { ...dayParam, in: "path", required: true, example: "today" },
        ...hoursParams,
      ],
      { 200: ok(withMeta({ day: ref("Day") })), ...timetableErrors },
    ),
    [`${timetablePath}/week`]: get(
      "getTimetableWeek",
      ["Timetables"],
      "Dated week",
      "The school week (Monday first) containing `from`, with real dates. Public holidays and school breaks are marked `dayOff: true` and have no slots.",
      [
        ...timetableParams,
        {
          name: "from",
          in: "query",
          description: "Any day of the wanted week, defaults to today",
          schema: date,
        },
        ...hoursParams,
      ],
      {
        200: ok(
          withMeta({
            weekStart: date,
            hours: { type: "array", items: ref("Hour") },
            days: { type: "array", items: ref("DatedDay") },
          }),
        ),
        ...timetableErrors,
      },
    ),
    [`${timetablePath}/now`]: get(
      "getTimetableNow",
      ["Timetables"],
      "Current and next lesson today",
      "What is going on right now (Europe/Warsaw). Holidays, school breaks and weekends report `dayOff: true` with no lessons. Never cached.",
      [...timetableParams, atParam, ...hoursParams],
      { 200: ok(ref("Now")), ...timetableErrors },
    ),
    [`${timetablePath}/next`]: get(
      "getTimetableNext",
      ["Timetables"],
      "Next lesson",
      `The next lesson that has not started yet, skipping weekends, holidays and school breaks (up to ${NEXT_LESSON_HORIZON_DAYS} days ahead). \`next\` is \`null\` when nothing is found. Never cached.`,
      [...timetableParams, atParam, ...hoursParams],
      {
        200: ok(withMeta({ at: dateTime, next: nullable(ref("NextLesson")) })),
        ...timetableErrors,
      },
    ),
    [`${timetablePath}/subjects`]: get(
      "getTimetableSubjects",
      ["Timetables"],
      "Subjects summary",
      "Every subject with the number of periods per week (split groups in one period count once), teachers, rooms, classes and groups. Sorted by periods per week.",
      timetableParams,
      {
        200: ok(
          withMeta({
            periodsPerWeek: integer,
            subjects: { type: "array", items: ref("Subject") },
          }),
        ),
        ...timetableErrors,
      },
    ),
    [`${timetablePath}/calendar`]: get(
      "getTimetableCalendar",
      ["Timetables"],
      "iCalendar feed",
      "Weekly recurring events until the end of the school year, with Polish holidays and school breaks excluded. Subscribe with `webcal://`. Honours `group`.",
      timetableParams,
      {
        200: {
          description: "iCalendar file",
          content: { "text/calendar": { schema: string } },
        },
        400: error("BadRequest"),
        404: error("NotFound"),
        500: json(ref("Error"), "Calendar could not be generated"),
        503: error("SourceUnavailable"),
      },
    ),
    "/api/v1/hours": get(
      "getHours",
      ["School"],
      "Bell schedule",
      "Lesson start and end times (the longest schedule in the school), optionally shortened.",
      hoursParams,
      {
        200: ok(ref("Hours")),
        304: notModified,
        400: error("BadRequest"),
        503: error("SourceUnavailable"),
      },
    ),
    "/api/v1/free-rooms": get(
      "getFreeRooms",
      ["School"],
      "Free rooms",
      "Rooms without a lesson, per day and lesson number. Without filters the whole week is returned. A day the timetable does not cover returns no days.",
      [
        { ...dayParam, in: "query" },
        {
          name: "lesson",
          in: "query",
          description: "Lesson number (`number` in the bell schedule)",
          schema: { type: "integer", minimum: 1 },
        },
      ],
      {
        200: ok(ref("FreeRooms")),
        304: notModified,
        400: error("BadRequest"),
        503: error("SourceUnavailable"),
      },
    ),
    "/api/v1/free-rooms/now": get(
      "getFreeRoomsNow",
      ["School"],
      "Free rooms right now",
      "Rooms free in the current lesson, or in the next one during a break (`lesson.upcoming: true`). `lesson` is `null` before school, after the last lesson and on days off. Never cached.",
      [atParam, ...hoursParams],
      {
        200: ok(ref("FreeRoomsNow")),
        400: error("BadRequest"),
        503: error("SourceUnavailable"),
      },
    ),
    "/api/v1/days-off": get(
      "getDaysOff",
      ["School"],
      "Days without school",
      "Polish public holidays, Christmas break, summer break and the regional winter break within the range.",
      [
        {
          name: "from",
          in: "query",
          description: "Start date, defaults to today",
          schema: date,
        },
        {
          name: "weeks",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 53, default: 4 },
        },
        {
          name: "weekends",
          in: "query",
          description: "Include Saturdays and Sundays",
          schema: { type: "string", enum: ["true", "false"], default: "false" },
        },
      ],
      { 200: ok(ref("DaysOff")), 304: notModified, 400: error("BadRequest") },
    ),
    "/api/v1/changes": get(
      "getPlanChanges",
      ["School"],
      "Latest plan changes",
      "The most recent set of changes found by the plan watcher, per timetable and period. Needs the watcher to run with a persistent snapshot (self-hosted deployments); otherwise `watcher` is `false` and `plans` is empty.",
      [
        { name: "type", in: "query", schema: ref("TimetableType") },
        {
          name: "id",
          in: "query",
          schema: { type: "string", pattern: "^\\d+$" },
        },
      ],
      { 200: ok(ref("Changes")), 304: notModified, 400: error("BadRequest") },
    ),
    "/api/v1/news": get(
      "getNews",
      ["School"],
      "School news",
      "Latest posts from the school website, cached for 15 minutes.",
      [
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 20, default: 5 },
        },
      ],
      {
        200: ok(ref("News")),
        304: notModified,
        400: error("BadRequest"),
        503: json(ref("Error"), "News feed unreachable"),
      },
    ),
  },
  components: {
    headers: {
      ETag: {
        description: "Weak entity tag of the body, send back as If-None-Match",
        schema: string,
      },
    },
    parameters: {
      Type: {
        name: "type",
        in: "path",
        required: true,
        schema: ref("TimetableType"),
      },
      Id: {
        name: "id",
        in: "path",
        required: true,
        description: "Numeric Optivum id",
        schema: { type: "string", pattern: "^\\d+$" },
        example: "1",
      },
      Group: {
        name: "group",
        in: "query",
        description:
          "Keep only lessons of this group (case-insensitive) plus whole-class lessons. See `groups` in the response.",
        schema: { type: "string", minLength: 1, maxLength: MAX_GROUP_LENGTH },
        example: "1/2",
      },
      Hours: {
        name: "hours",
        in: "query",
        description:
          "`normal` uses the school bell schedule, `short` the 30-minute shortened one, `custom` shortens every lesson from `shortenFrom` on to 30 minutes with 5-minute breaks",
        schema: {
          type: "string",
          enum: ["normal", "short", "custom"],
          default: "normal",
        },
      },
      ShortenFrom: {
        name: "shortenFrom",
        in: "query",
        description:
          "First shortened lesson number, required with `hours=custom`",
        schema: { type: "integer", minimum: 1, maximum: MAX_LESSONS },
      },
    },
    responses: {
      BadRequest: json(ref("Error"), "Invalid parameter"),
      NotFound: json(ref("Error"), "No such timetable"),
      SourceUnavailable: json(
        ref("Error"),
        "Upstream timetable source is unreachable",
      ),
    },
    schemas: {
      TimetableType: { type: "string", enum: ["class", "teacher", "room"] },
      Error: object({
        error: object({
          status: { type: "integer", examples: [404] },
          code: { type: "string", enum: ERROR_CODES },
          message: {
            type: "string",
            examples: ["No class timetable with id 999"],
          },
        }),
      }),
      ListItem: object({
        type: ref("TimetableType"),
        id: { type: "string", examples: ["1"] },
        name: { type: "string", examples: ["1TA"] },
        url: uri,
      }),
      TimetableList: object({
        count: integer,
        items: { type: "array", items: ref("ListItem") },
      }),
      SearchResult: object({
        query: { type: "string", description: "The query as sent" },
        count: integer,
        items: { type: "array", items: ref("ListItem") },
      }),
      Hour: loose({
        number: { type: "integer", examples: [1] },
        timeFrom: time,
        timeTo: time,
      }),
      Hours: object({
        count: integer,
        hours: { type: "array", items: ref("Hour") },
      }),
      Entry: object(
        {
          subject: { type: "string", examples: ["matematyka"] },
          groupName: { type: "string", examples: ["1/2"] },
          teacher: { type: "string", examples: ["WJ"] },
          teacherId: { type: "string", examples: ["70"] },
          room: { type: "string", examples: ["B17"] },
          roomId: { type: "string", examples: ["25"] },
          className: { type: "string", examples: ["4TP"] },
          classId: { type: "string", examples: ["27"] },
        },
        ["subject"],
      ),
      Slot: {
        allOf: [
          ref("Hour"),
          {
            type: "object",
            required: ["entries"],
            properties: { entries: { type: "array", items: ref("Entry") } },
          },
        ],
        unevaluatedProperties: false,
      },
      Day: object({
        index: { type: "integer", minimum: 0, maximum: 6 },
        name: nullable({ type: "string", examples: ["Poniedziałek"] }),
        slots: { type: "array", items: ref("Slot") },
      }),
      DatedDay: object({
        index: { type: "integer", minimum: 0, maximum: 6 },
        name: nullable(string),
        date,
        dayOff: boolean,
        slots: { type: "array", items: ref("Slot") },
      }),
      Ref: object({ id: nullable(string), name: string }),
      TimetableMeta: {
        type: "object",
        required: [
          "type",
          "id",
          "code",
          "title",
          "generatedAt",
          "validFrom",
          "groups",
          "links",
        ],
        properties: {
          type: ref("TimetableType"),
          id: { type: "string", examples: ["27"] },
          code: {
            type: "string",
            description: "Optivum file code: o = class, n = teacher, s = room",
            examples: ["o27"],
          },
          title: { type: "string", examples: ["4TP"] },
          generatedAt: nullable(date),
          validFrom: nullable(date),
          groups: {
            type: "array",
            items: string,
            description: "Group names that appear in the timetable",
          },
          links: object({ web: uri, api: uri, calendar: uri }),
        },
      },
      Now: withMeta({
        at: dateTime,
        date,
        dayIndex: { type: "integer", minimum: 0, maximum: 6 },
        dayName: nullable(string),
        dayOff: {
          type: "boolean",
          description: "Weekend, public holiday or school break",
        },
        current: nullable({
          allOf: [
            ref("Slot"),
            {
              type: "object",
              required: ["minutesLeft"],
              properties: { minutesLeft: integer },
            },
          ],
        }),
        next: nullable({
          allOf: [
            ref("Slot"),
            {
              type: "object",
              required: ["startsInMinutes"],
              properties: { startsInMinutes: integer },
            },
          ],
        }),
        isBreak: {
          type: "boolean",
          description: "Between two lessons of the day",
        },
        isOver: {
          type: "boolean",
          description: "All lessons of the day are over",
        },
      }),
      NextLesson: {
        allOf: [
          ref("Slot"),
          {
            type: "object",
            required: [
              "date",
              "dayIndex",
              "dayName",
              "startsAt",
              "startsInMinutes",
            ],
            properties: {
              date,
              dayIndex: integer,
              dayName: nullable(string),
              startsAt: dateTime,
              startsInMinutes: integer,
            },
          },
        ],
      },
      Subject: object({
        subject: string,
        periodsPerWeek: integer,
        teachers: { type: "array", items: ref("Ref") },
        rooms: { type: "array", items: ref("Ref") },
        classes: { type: "array", items: ref("Ref") },
        groups: { type: "array", items: string },
      }),
      Room: object({ id: string, name: string }),
      FreeRooms: object({
        totalRooms: integer,
        days: {
          type: "array",
          items: object({
            index: integer,
            name: string,
            slots: {
              type: "array",
              items: {
                allOf: [
                  ref("Hour"),
                  {
                    type: "object",
                    required: ["rooms"],
                    properties: {
                      rooms: { type: "array", items: ref("Room") },
                    },
                  },
                ],
              },
            },
          }),
        },
      }),
      FreeRoomsNow: object({
        at: dateTime,
        date,
        dayIndex: integer,
        dayOff: boolean,
        lesson: nullable({
          allOf: [
            ref("Hour"),
            {
              type: "object",
              required: ["upcoming"],
              properties: { upcoming: boolean },
            },
          ],
        }),
        rooms: { type: "array", items: ref("Room") },
      }),
      DaysOff: object({
        from: date,
        weeks: integer,
        weekends: boolean,
        count: integer,
        days: { type: "array", items: date },
      }),
      ChangeEntry: object({
        subject: string,
        groupName: nullable(string),
        teacher: nullable(string),
        room: nullable(string),
      }),
      Changes: object({
        watcher: {
          type: "boolean",
          description: "Whether this deployment runs the plan watcher",
        },
        checkedAt: nullable(dateTime),
        detectedAt: nullable(dateTime),
        validFrom: nullable(date),
        count: integer,
        plans: {
          type: "array",
          items: object({
            type: ref("TimetableType"),
            id: string,
            title: string,
            count: integer,
            changes: {
              type: "array",
              items: object({
                dayIndex: integer,
                lesson: integer,
                before: { type: "array", items: ref("ChangeEntry") },
                after: { type: "array", items: ref("ChangeEntry") },
              }),
            },
          }),
        },
      }),
      News: object({
        count: integer,
        posts: {
          type: "array",
          items: object({
            id: integer,
            date: string,
            link: uri,
            title: string,
          }),
        },
      }),
      Status: object({
        ok: boolean,
        version: string,
        time: dateTime,
        counts: object({ class: integer, teacher: integer, room: integer }),
        generatedAt: nullable(date),
        validFrom: nullable(date),
      }),
      Index: object({
        name: string,
        version: string,
        docs: uri,
        openapi: uri,
        endpoints: {
          type: "array",
          items: object({ method: string, path: string, summary: string }),
        },
      }),
    },
  },
});
