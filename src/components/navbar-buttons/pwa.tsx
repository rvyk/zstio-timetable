"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAButton: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler as EventListenerOrEventListenerObject,
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListenerOrEventListenerObject,
      );
  }, []);

  const install = () => {
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <ButtonWrapper tooltipText="Zainstaluj apkę" onClick={install}>
      <DownloadIcon className="h-4 w-4" />
    </ButtonWrapper>
  );
};

export default PWAButton;
