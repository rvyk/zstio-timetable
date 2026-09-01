import { TIMETABLE_TAG } from "@/constants/settings";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  const secret = env.PLAN_WATCH_SECRET;
  const provided = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!secret || provided !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidateTag(TIMETABLE_TAG, "max");

  return Response.json({ revalidated: true });
};
