import { BottomBar } from "@/components/common/BottomBar";
import { Topbar } from "@/components/topbar/Topbar";
import { WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Brak połączenia",
  robots: { index: false, follow: false },
};

export default function Offline() {
  return (
    <Fragment>
      <main className="flex h-full w-full min-w-0 flex-1 flex-col gap-y-3 max-md:overflow-y-auto max-md:pb-[calc(4rem+env(safe-area-inset-bottom))] md:overflow-hidden md:p-3">
        <Topbar showLessonSwitcher={false} />
        <section className="border-lines bg-foreground flex w-full flex-1 flex-col md:overflow-hidden md:rounded-xl md:border md:shadow-(--shadow-soft)">
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-10 text-center">
            <div className="border-lines bg-accent grid size-12 place-content-center rounded-xl border">
              <WifiOff className="text-primary/40 size-5" strokeWidth={1.75} />
            </div>
            <div className="grid gap-1">
              <h2 className="text-primary/90 text-base font-medium tracking-tight">
                Jesteś offline
              </h2>
              <p className="text-primary/50 max-w-xs text-sm">
                Złap zasięg, żeby załadować plan zajęć. Ostatnio otwarte plany
                zostały zapisane i działają bez internetu.
              </p>
            </div>
          </div>
        </section>
      </main>
      <BottomBar isOffline={true} />
    </Fragment>
  );
}
