import { env } from "@/env";
import { runPlanWatch } from "@/lib/runPlanWatch";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const secret = env.PLAN_WATCH_SECRET;
  const header = request.headers.get("authorization");
  const provided = header
    ? header.replace(/^Bearer\s+/i, "")
    : new URL(request.url).searchParams.get("secret");

  if (!secret || provided !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { checked, changed, notified } = await runPlanWatch();

  return Response.json({
    checked,
    notified,
    changed: changed.map((plan) => ({
      id: plan.id,
      title: plan.title,
      type: plan.type,
      count: plan.count,
      lines: plan.lines,
    })),
  });
};
