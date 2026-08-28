import { getOptivumList } from "@/actions/getOptivumList";
import { getOptivumTimetable } from "@/actions/getOptivumTimetable";
import { env } from "@/env";
import { planGrid, type PlanGrid } from "@/lib/planDiff";
import { planEmbed, summarizeChanges, type ChangedPlan } from "@/lib/planWatch";
import type { OptivumTimetable } from "@/types/optivum";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const snapshotPath = () =>
  env.PLAN_SNAPSHOT_PATH ?? "./data/plan-snapshots.json";

const CONCURRENCY = 8;

type Snapshots = Record<string, PlanGrid>;

const readSnapshots = async (): Promise<Snapshots> => {
  try {
    return JSON.parse(
      await readFile(/*turbopackIgnore: true*/ snapshotPath(), "utf8"),
    ) as Snapshots;
  } catch {
    return {};
  }
};

const writeSnapshots = async (snapshots: Snapshots) => {
  const payload = JSON.stringify(snapshots);

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
  const list = await getOptivumList();
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

  const snapshots = await readSnapshots();
  const isFirstRun = Object.keys(snapshots).length === 0;
  const changed: ChangedPlan[] = [];
  const next: Snapshots = {};

  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    await Promise.all(
      targets.slice(i, i + CONCURRENCY).map(async ({ type, value }) => {
        const timetable = await getOptivumTimetable(type, value);
        const grid = planGrid(timetable.lessons);

        if (!grid.some((day) => day.some(Boolean))) return;

        next[timetable.id] = grid;

        const before = snapshots[timetable.id];
        if (!before) return;

        const summary = summarizeChanges(value, timetable, before, grid);
        if (summary) changed.push(summary);
      }),
    );
  }

  await writeSnapshots(next);

  const notified =
    changed.length > 0 && !isFirstRun && Boolean(env.DISCORD_WEBHOOK_URL);

  if (notified) {
    await postToDiscord(
      changed.map((plan) => planEmbed(plan, env.NEXT_PUBLIC_APP_URL)),
    );
  }

  return { checked: Object.keys(next).length, changed, notified };
};

const MINUTE = 60_000;

export const startPlanWatchCron = () => {
  const minutes = Number(env.PLAN_WATCH_INTERVAL_MINUTES ?? 0);
  if (!minutes || !env.DISCORD_WEBHOOK_URL || process.env.VERCEL) return;

  const tick = () =>
    void runPlanWatch()
      .then(({ checked, changed, notified }) => {
        console.warn(
          `[plan-watch] sprawdzono ${checked} planów, zmienionych: ${changed.length}, wysłano: ${notified}`,
        );
      })
      .catch((error: unknown) => {
        console.error("[plan-watch] cron failed:", error);
      });

  setTimeout(tick, MINUTE).unref();
  setInterval(tick, minutes * MINUTE).unref();
};
