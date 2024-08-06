import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "https://discord.gg/5XCb2JzW https://discord.gg/DFadgeRr",
  process.env.NEXT_PUBLIC_VAPID_KEY as string,
  process.env.PRIVATE_VAPID_KEY as string,
);

const subscriptions: webpush.PushSubscription[] = [];

export function GET() {
  try {
    sendNotification(
      subscriptions,
      JSON.stringify({ title: "Hello", message: "World" }),
    );
    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function POST(req: Request) {
  const subscription = (await req.json()) as webpush.PushSubscription;
  subscriptions.push(subscription);
  return NextResponse.json({ success: true });
}

function sendNotification(
  subscriptions: webpush.PushSubscription[],
  dataToSend: string | Buffer | null,
) {
  subscriptions.forEach((subscription) => {
    webpush
      .sendNotification(subscription, dataToSend)
      .then(() => {
        console.log("Notification sent to: ", subscription.endpoint);
      })
      .catch((error) => {
        console.error("Error sending notification, reason: ", error);
      });
  });
}
