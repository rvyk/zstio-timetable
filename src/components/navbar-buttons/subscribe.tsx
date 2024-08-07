"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { BellAlertIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const SubscribeButton: React.FC = () => {
  const [isSubscribe, setIsSubscribe] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribe(subscription != null);
      } catch (error) {
        console.log(error);
      }
    };
    checkSubscription();
  }, []);

  const unsubscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      await subscription?.unsubscribe();
      setIsSubscribe(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkPermission = (permission?: NotificationPermission) => {
    if (permission === "granted" || Notification.permission === "granted") {
      return subscribeUser();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(checkPermission);
    }
  };

  async function subscribeUser() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if ((await res.json()).success) {
        setIsSubscribe(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ButtonWrapper
      onClick={isSubscribe ? () => unsubscribeUser() : () => checkPermission()}
      tooltipText={isSubscribe ? "Wyłącz powiadomienia" : "Włącz powiadomienia"}
    >
      {isSubscribe ? (
        <BellSlashIcon className="h-4 w-4" />
      ) : (
        <BellAlertIcon className="h-4 w-4" />
      )}
    </ButtonWrapper>
  );
};

export default SubscribeButton;
