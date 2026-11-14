import { getOptivumList } from "@/actions/getOptivumList";
import { API_VERSION, LIST_KEY, TYPES } from "@/lib/api";
import { isoFromOptivum } from "@/lib/apiShape";
import { getTimetable } from "@/lib/timetableRoute";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const list = await getOptivumList();
  const sample = list.classes[0]
    ? await getTimetable("class", list.classes[0].value)
    : null;
  const healthy = Boolean(sample?.title);

  return Response.json(
    {
      ok: healthy,
      version: API_VERSION,
      time: new Date().toISOString(),
      counts: Object.fromEntries(
        TYPES.map((type) => [type, (list[LIST_KEY[type]] ?? []).length]),
      ),
      generatedAt: healthy
        ? isoFromOptivum(sample?.generatedDate ?? null)
        : null,
      validFrom: healthy ? isoFromOptivum(sample?.validDate ?? null) : null,
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
    },
  );
};
