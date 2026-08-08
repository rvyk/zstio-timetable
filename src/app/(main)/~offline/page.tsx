import { BottomBar } from "@/components/common/BottomBar";
import { Topbar } from "@/components/topbar/Topbar";
import { WifiOff } from "lucide-react";
import { Fragment } from "react";

export default function Offline() {
  return (
    <Fragment>
      <div className="flex h-full w-full flex-col gap-y-3 max-md:overflow-y-auto md:gap-y-6 md:overflow-hidden md:p-8">
        <Topbar isOffline={true} />
        <div className="border-lines bg-foreground flex flex-1 w-full flex-col transition-all max-md:mb-20 md:overflow-hidden md:rounded-md md:border">
          <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <WifiOff className="text-primary/70 dark:text-primary/80 h-10 w-10" />
            <h2 className="text-lg font-semibold">Jesteś offline</h2>
            <p className="text-sm">
              Brak połączenia z internetem. Złap zasięg, aby załadować plan zajęć.
            </p>
          </div>
        </div>
        <BottomBar isOffline={true} />
      </div>
    </Fragment>
  );
}
