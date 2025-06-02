"use server";

import db from "@/lib/redis";
import webpush from "web-push";

if (
  process.env.VAPID_APP_EMAIL &&
  process.env.NEXT_PUBLIC_VAPID_KEY &&
  process.env.VAPID_PRIVATE_KEY
) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_APP_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}

export async function subscribeUser(sub: webpush.PushSubscription): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!db) return { success: false, error: "Baza danych nie jest dostępna" };
    await db.sAdd("subscriptions", JSON.stringify(sub));
    return { success: true };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return { success: false };
  }
}

export async function sendNotification({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  if (!db) return false;
  const subscriptions = await db.sMembers("subscriptions");

  if (!subscriptions.length) {
    return false;
  }

  await Promise.all(
    subscriptions.map(async (subStr) => {
      const subscription = JSON.parse(subStr);
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title,
            body: message,
          }),
        );
      } catch (error) {
        console.error("Error sending push notification:", error);
        if (!db) return;
        await db.sRem("subscriptions", subStr);
      }
    }),
  );

  return true;
}
