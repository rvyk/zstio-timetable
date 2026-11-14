import { fail, listItems, loadList, ok } from "@/lib/api";
import { normalizeSearch } from "@/lib/apiShape";
import { isTimetableType } from "@/lib/timetableRoute";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get("type");
  const query = normalizeSearch(searchParams.get("q") ?? "").trim();

  if (type !== null && !isTimetableType(type)) {
    return fail(
      400,
      "invalid_type",
      "Type must be one of: class, teacher, room",
    );
  }

  const { list, error } = await loadList();
  if (error) return error;

  const items = listItems(list, type ?? undefined).filter(
    (item) => !query || normalizeSearch(item.name).includes(query),
  );

  return ok(request, { count: items.length, items });
};
