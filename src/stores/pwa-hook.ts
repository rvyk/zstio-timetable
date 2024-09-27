import { useEffect, useState } from "react";

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwa(): [IBeforeInstallPromptEvent | null, boolean] {
  const [promptable, setPromptable] =
    useState<IBeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      setPromptable(e);
    };

    window.addEventListener("beforeinstallprompt", ready as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as EventListener);
    };
  }, []);

  useEffect(() => {
    const onInstall = () => {
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", onInstall as EventListener);

    return () => {
      window.removeEventListener("appinstalled", onInstall as EventListener);
    };
  }, []);

  return [promptable, isInstalled];
}
