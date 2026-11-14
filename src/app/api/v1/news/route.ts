import { fail, ok } from "@/lib/api";
import { getSchoolNews } from "@/lib/schoolNews";

export const GET = async (request: Request) => {
  const rawLimit = new URL(request.url).searchParams.get("limit") ?? "5";
  const limit = Number(rawLimit);

  if (!/^\d+$/.test(rawLimit) || limit < 1 || limit > 20) {
    return fail(
      400,
      "invalid_limit",
      "limit must be an integer between 1 and 20",
    );
  }

  const posts = await getSchoolNews(limit);
  if (!posts) {
    return fail(503, "news_unavailable", "School news feed is unreachable");
  }

  return ok(request, { count: posts.length, posts });
};
