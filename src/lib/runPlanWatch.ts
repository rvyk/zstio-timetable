import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { env } from "@/env";
import { planGrid, type PlanGrid } from "@/lib/planDiff";
import { planEmbed, summarizeChanges, type ChangedPlan } from "@/lib/planWatch";
import type { OptivumTimetable } from "@/types/optivum";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const snapshotPath = () =>
  env.PLAN_SNAPSHOT_PATH ?? "./data/plan-snapshots.json";

const CONCURRENCY = 3;
const PROBE_FALLBACK = "1";

type Snapshots = Record<string, PlanGrid>;

interface SnapshotFile {
  generatedDate: string | null;
  probe: string;
  grids: Snapshots;
}

const EMPTY_FILE: SnapshotFile = {
  generatedDate: null,
  probe: PROBE_FALLBACK,
  grids: {},
};

const readSnapshots = async (): Promise<SnapshotFile> => {
  try {
    const parsed = JSON.parse(
      await readFile(/*turbopackIgnore: true*/ snapshotPath(), "utf8"),
    ) as Partial<SnapshotFile>;

    if (!parsed.grids) return EMPTY_FILE;

    return {
      generatedDate: parsed.generatedDate ?? null,
      probe: parsed.probe ?? PROBE_FALLBACK,
      grids: parsed.grids,
    };
  } catch {
    return EMPTY_FILE;
  }
};

const writeSnapshots = async (file: SnapshotFile) => {
  const payload = JSON.stringify(file);

  await mkdir(dirname(snapshotPath()), { recursive: true });
  await writeFile(/*turbopackIgnore: true*/ snapshotPath(), payload, "utf8");
};

const postToDiscord = async (embeds: object[]) => {
  const webhook = env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  for (let i = 0; i < embeds.length; i += 10) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          i === 0
            ? `📅 Wykryto zmiany w planie lekcji (${embeds.length} ${embeds.length === 1 ? "plan" : "planów"})`
            : undefined,
        embeds: embeds.slice(i, i + 10),
      }),
    });

    if (!response.ok) {
      console.error(
        "Discord webhook failed:",
        response.status,
        await response.text(),
      );
    }
  }
};

export const runPlanWatch = async () => {
  const stored = await readSnapshots();
  const isFirstRun = Object.keys(stored.grids).length === 0;

  const probe = await getOptivumTimetable("class", stored.probe);

  if (!probe.title) {
    return { checked: 0, changed: [], notified: false, skipped: "unreachable" };
  }

  if (!isFirstRun && probe.generatedDate === stored.generatedDate) {
    return { checked: 0, changed: [], notified: false, skipped: "unchanged" };
  }

  const list = probe.list;
  const targets: { type: OptivumTimetable["type"]; value: string }[] = [
    ...list.classes.map((item) => ({
      type: "class" as const,
      value: item.value,
    })),
    ...(list.teachers ?? []).map((item) => ({
      type: "teacher" as const,
      value: item.value,
    })),
    ...(list.rooms ?? []).map((item) => ({
      type: "room" as const,
      value: item.value,
    })),
  ];

  const changed: ChangedPlan[] = [];
  const grids: Snapshots = {};

  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    await Promise.all(
      targets.slice(i, i + CONCURRENCY).map(async ({ type, value }) => {
        const timetable = await getOptivumTimetable(type, value);
        const grid = planGrid(timetable.lessons);

        if (!grid.some((day) => day.some(Boolean))) return;

        grids[timetable.id] = grid;

        const before = stored.grids[timetable.id];
        if (!before) return;

        const summary = summarizeChanges(value, timetable, before, grid);
        if (summary) changed.push(summary);
      }),
    );
  }

  if (Object.keys(grids).length === 0) {
    return { checked: 0, changed: [], notified: false, skipped: "unreachable" };
  }

  await writeSnapshots({
    generatedDate: probe.generatedDate,
    probe: list.classes[0]?.value ?? stored.probe,
    grids,
  });

  const notified =
    changed.length > 0 && !isFirstRun && Boolean(env.DISCORD_WEBHOOK_URL);

  if (notified) {
    await postToDiscord(
      changed.map((plan) => planEmbed(plan, env.NEXT_PUBLIC_APP_URL)),
    );
  }

  return {
    checked: Object.keys(grids).length,
    changed,
    notified,
    skipped: null,
  };
};

const MINUTE = 60_000;

export const startPlanWatchCron = () => {
  const minutes = Number(env.PLAN_WATCH_INTERVAL_MINUTES ?? 0);
  if (!minutes || !env.DISCORD_WEBHOOK_URL || process.env.VERCEL) return;

  const tick = () =>
    void runPlanWatch()
      .then(({ checked, changed, notified, skipped }) => {
        console.warn(
          skipped
            ? `[plan-watch] pominięto przebieg (${skipped})`
            : `[plan-watch] sprawdzono ${checked} planów, zmienionych: ${changed.length}, wysłano: ${notified}`,
        );
      })
      .catch((error: unknown) => {
        console.error("[plan-watch] cron failed:", error);
      });

  setTimeout(tick, MINUTE).unref();
  setInterval(tick, minutes * MINUTE).unref();
};
