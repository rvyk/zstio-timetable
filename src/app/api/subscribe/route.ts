import db from "@/lib/firestore";
import { addDoc, collection } from "@firebase/firestore";
import { NextResponse } from "next/server";
import webpush from "web-push";

export async function POST(req: Request) {
  try {
    const subscription = (await req.json()) as webpush.PushSubscription;
    const ref = await addDoc(collection(db, "subscribers"), subscription);
    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    return NextResponse.json(error);
  }
}
