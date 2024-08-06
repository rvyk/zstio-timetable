"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { BellAlertIcon, BellSlashIcon } from "@heroicons/react/24/outline";

const SubscribeButton: React.FC = () => {
  const isSubstitution = false;

  async function subscribeUser() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ButtonWrapper
      onClick={subscribeUser}
      tooltipText={
        isSubstitution ? "Wyłącz powiadomienia" : "Włącz powiadomienia"
      }
    >
      {isSubstitution ? (
        <BellSlashIcon className="h-4 w-4" />
      ) : (
        <BellAlertIcon className="h-4 w-4" />
      )}
    </ButtonWrapper>
  );
};

export default SubscribeButton;
