import { CACHE_SHORT, fail, ok } from "@/lib/api";
import { isoFromOptivum, parseChangeCell } from "@/lib/apiShape";
import { readPlanWatchState } from "@/lib/runPlanWatch";
import { isTimetableType } from "@/lib/timetableRoute";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (type !== null && !isTimetableType(type)) {
    return fail(
      400,
      "invalid_type",
      "Type must be one of: class, teacher, room",
    );
  }
  if (id !== null && !/^\d+$/.test(id)) {
    return fail(400, "invalid_id", "Id must be numeric");
  }

  const { enabled, checkedAt, lastChanges } = await readPlanWatchState();

  const plans = (lastChanges?.plans ?? [])
    .filter(
      (plan) => (!type || plan.type === type) && (!id || plan.value === id),
    )
    .map((plan) => ({
      type: plan.type,
      id: plan.value,
      title: plan.title,
      count: plan.changes.length,
      changes: plan.changes.map((change) => ({
        dayIndex: change.dayIndex,
        lesson: change.hourIndex + 1,
        before: parseChangeCell(change.before),
        after: parseChangeCell(change.after),
      })),
    }));

  return ok(
    request,
    {
      watcher: enabled,
      checkedAt,
      detectedAt: lastChanges?.detectedAt ?? null,
      validFrom: isoFromOptivum(lastChanges?.validDate ?? null),
      count: plans.length,
      plans,
    },
    CACHE_SHORT,
  );
};
