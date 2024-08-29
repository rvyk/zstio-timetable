"use server";

import db from "@/lib/firestore";
import { addDoc, collection } from "@firebase/firestore";

export const subscribe = async (subscription: PushSubscription) => {
  try {
    await addDoc(collection(db, "subscribers"), subscription);
    return true;
  } catch (error) {
    return false;
  }
};
