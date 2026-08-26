import type { PlanGrid } from "@/lib/planDiff";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_SNAPSHOTS = 8;

export interface PlanSnapshot {
  generatedDate: string | null;
  grid: PlanGrid;
  savedAt: number;
}

interface PlanSnapshotStore {
  snapshots: Record<string, PlanSnapshot>;
  save: (id: string, snapshot: Omit<PlanSnapshot, "savedAt">) => void;
}

export const usePlanSnapshotStore = create<PlanSnapshotStore>()(
  persist(
    (set) => ({
      snapshots: {},

      save: (id, snapshot) =>
        set((state) => {
          const snapshots = {
            ...state.snapshots,
            [id]: { ...snapshot, savedAt: Date.now() },
          };

          const kept = Object.entries(snapshots)
            .sort(([, a], [, b]) => b.savedAt - a.savedAt)
            .slice(0, MAX_SNAPSHOTS);

          return { snapshots: Object.fromEntries(kept) };
        }),
    }),
    { name: "plan-snapshots" },
  ),
);
