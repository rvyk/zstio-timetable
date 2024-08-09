import { collection, deleteDoc, getDocs } from "@firebase/firestore";
import webpush, { WebPushError } from "web-push";
import db from "./firestore";

webpush.setVapidDetails(
  "https://discord.gg/5XCb2JzW",
  process.env.NEXT_PUBLIC_VAPID_KEY as string,
  process.env.PRIVATE_VAPID_KEY as string,
);

export const sendNotification = async (dataToSend: {
  title: string;
  options: NotificationOptions;
}) => {
  const querySnapshot = await getDocs(collection(db, "subscribers"));

  querySnapshot.forEach((subscription) => {
    webpush
      .sendNotification(
        subscription.data() as webpush.PushSubscription,
        JSON.stringify(dataToSend),
      )
      .catch((error) => {
        console.log(error);
        if (error instanceof WebPushError && error.statusCode === 410) {
          deleteDoc(subscription.ref);
        }
      });
  });
};
