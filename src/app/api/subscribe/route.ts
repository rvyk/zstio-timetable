import db from "@/lib/firestore";
import { addDoc, collection } from "@firebase/firestore";
import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "https://discord.gg/5XCb2JzW https://discord.gg/DFadgeRr",
  process.env.NEXT_PUBLIC_VAPID_KEY as string,
  process.env.PRIVATE_VAPID_KEY as string,
);

// export async function GET() {
//   try {
//     sendNotification({
//       title: "Welcome to the Notification Demo",
//       options: {
//         body: "You will now receive notifications from this website.",
//         icon: "/favicon.ico",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//     });
//   } catch (error) {
//     return NextResponse.json(error);
//   }
// }

export async function POST(req: Request) {
  try {
    const subscription = (await req.json()) as webpush.PushSubscription;
    const ref = await addDoc(collection(db, "subscribers"), subscription);
    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    return NextResponse.json(error);
    Notification;
  }
}
