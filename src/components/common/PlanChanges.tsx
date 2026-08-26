"use client";

import { useLocale, useT } from "@/components/common/LocaleProvider";
import { dayLabel } from "@/lib/i18n";
import { describeCell, planChanges, planGrid } from "@/lib/planDiff";
import { cn } from "@/lib/utils";
import { usePlanSnapshotStore } from "@/stores/planSnapshots";
import type { OptivumTimetable } from "@/types/optivum";
import { Check, ChevronDown, GitCompareArrows } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useIsClient } from "usehooks-ts";

const VISIBLE_CHANGES = 6;
const CONFIRM_MS = 700;

export const PlanChanges: FC<{ timetable: OptivumTimetable }> = ({
  timetable,
}) => {
  const translate = useT();
  const locale = useLocale();
  const isMounted = useIsClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [phase, setPhase] = useState<"idle" | "read" | "gone">("idle");

  const snapshot = usePlanSnapshotStore(
    (state) => state.snapshots[timetable.id],
  );
  const save = usePlanSnapshotStore((state) => state.save);

  const grid = useMemo(() => planGrid(timetable.lessons), [timetable.lessons]);
  const changes = useMemo(
    () => (snapshot ? planChanges(snapshot.grid, grid) : []),
    [snapshot, grid],
  );

  const hasLessons = grid.some((day) => day.some(Boolean));

  useEffect(() => {
    if (!isMounted || !timetable.id || !hasLessons || snapshot) return;
    save(timetable.id, { generatedDate: timetable.generatedDate, grid });
  }, [
    isMounted,
    timetable.id,
    timetable.generatedDate,
    hasLessons,
    snapshot,
    grid,
    save,
  ]);

  useEffect(() => {
    if (phase !== "read") return;

    const timeout = setTimeout(() => {
      setPhase("gone");
      save(timetable.id, { generatedDate: timetable.generatedDate, grid });
    }, CONFIRM_MS);

    return () => clearTimeout(timeout);
  }, [phase, save, timetable.id, timetable.generatedDate, grid]);

  if (!isMounted || changes.length === 0) return null;

  const describe = ({
    dayIndex,
    hourIndex,
    before,
    after,
  }: (typeof changes)[number]) => {
    const day = dayLabel(locale, timetable.dayNames[dayIndex] ?? "", "long");
    const where = translate("changes.lesson", { day, number: hourIndex + 1 });

    if (!before) {
      const what = describeCell(after);
      return `${where} — ${translate("changes.added", { what })}`;
    }

    if (!after) {
      const what = describeCell(before);
      return `${where} — ${translate("changes.removed", { what })}`;
    }

    return `${where} — ${describeCell(before)} → ${describeCell(after)}`;
  };

  return (
    <div
      className={cn(
        "ease-out-quint grid shrink-0 transition-all duration-300 motion-reduce:transition-none",
        phase === "gone"
          ? "-mb-3 grid-rows-[0fr] opacity-0"
          : "grid-rows-[1fr] opacity-100",
      )}
      aria-hidden={phase === "gone"}
      inert={phase === "gone"}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "border-lines bg-foreground animate-rise mx-3 grid gap-2 rounded-xl border px-3 py-2.5 shadow-(--shadow-soft) transition duration-300 md:mx-0",
            phase !== "idle" && "border-primary/15 scale-[0.99]",
          )}
        >
          <div className="flex items-center gap-2.5">
            {phase === "idle" ? (
              <GitCompareArrows
                className="text-accent-table size-4 shrink-0"
                strokeWidth={2}
              />
            ) : (
              <Check
                className="text-primary animate-pop size-4 shrink-0"
                strokeWidth={2.5}
              />
            )}

            <span className="grid min-w-0 flex-1 gap-0.5">
              <span
                className={cn(
                  "truncate text-[13px] leading-tight font-medium transition-colors duration-300",
                  phase === "idle" ? "text-primary" : "text-primary/60",
                )}
              >
                {translate("changes.title")}
              </span>
              <span className="text-primary/55 truncate text-[11px] leading-tight">
                {phase === "idle" ? (
                  translate("changes.summary", { count: changes.length })
                ) : (
                  <span className="animate-rise inline-block">
                    {translate("changes.dismissed")}
                  </span>
                )}
              </span>
            </span>

            {phase === "idle" && (
              <>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                  aria-label={translate(
                    isExpanded ? "changes.hide" : "changes.show",
                  )}
                  title={translate(
                    isExpanded ? "changes.hide" : "changes.show",
                  )}
                  className="text-primary hover:bg-primary/5 grid size-7 shrink-0 place-content-center rounded-md opacity-50 transition hover:opacity-100 active:scale-90"
                >
                  <ChevronDown
                    className={cn(
                      isExpanded && "rotate-180",
                      "size-4 transition-transform duration-300",
                    )}
                    strokeWidth={2}
                  />
                </button>
                <button
                  onClick={() => setPhase("read")}
                  aria-label={translate("changes.dismiss")}
                  title={translate("changes.dismiss")}
                  className="text-primary hover:bg-primary/5 grid size-7 shrink-0 place-content-center rounded-md opacity-50 transition hover:opacity-100 active:scale-90"
                >
                  <Check className="size-4" strokeWidth={2} />
                </button>
              </>
            )}
          </div>

          {isExpanded && phase === "idle" && (
            <ul className="border-lines text-primary/72 grid gap-1 border-t pt-2 text-[11px] leading-relaxed">
              {changes.slice(0, VISIBLE_CHANGES).map((change) => (
                <li key={`${change.dayIndex}-${change.hourIndex}`}>
                  {describe(change)}
                </li>
              ))}
              {changes.length > VISIBLE_CHANGES && (
                <li className="text-primary/50">
                  {translate("changes.more", {
                    count: changes.length - VISIBLE_CHANGES,
                  })}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
