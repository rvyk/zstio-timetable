import { fail, listItems, loadList, ok } from "@/lib/api";
import { normalizeSearch } from "@/lib/apiShape";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const raw = (searchParams.get("q") ?? "").trim();
  const query = normalizeSearch(raw);
  const rawLimit = searchParams.get("limit") ?? "10";
  const limit = Number(rawLimit);

  if (!query) return fail(400, "missing_query", "q is required");
  if (!/^\d+$/.test(rawLimit) || limit < 1 || limit > 100) {
    return fail(
      400,
      "invalid_limit",
      "limit must be an integer between 1 and 100",
    );
  }

  const { list, error } = await loadList();
  if (error) return error;

  const items = listItems(list)
    .map((item) => {
      const name = normalizeSearch(item.name);
      const score = name === query ? 0 : name.startsWith(query) ? 1 : 2;
      return { item, name, score };
    })
    .filter(({ name }) => name.includes(query))
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ item }) => item);

  return ok(request, { query: raw, count: items.length, items });
};
