import zstioLogo1024 from "@/media/icon-1024x1024.png";
import { collection, deleteDoc, getDocs } from "@firebase/firestore";
import webpush, { WebPushError } from "web-push";
import db from "./firestore";
import {
  getLastSubstitutionDate,
  getLastTimetableDate,
  setLastSubstitutionDate,
  setLastTimetableDate,
} from "./getLastDates";

webpush.setVapidDetails(
  "https://discord.gg/5XCb2JzW",
  process.env.NEXT_PUBLIC_VAPID_KEY as string,
  process.env.PRIVATE_VAPID_KEY as string,
);

export const notify = async (
  type: "timetable" | "substitution",
  date: string,
) => {
  if (
    (type == "timetable" && (await getLastTimetableDate()) != date) ||
    (type == "substitution" && (await getLastSubstitutionDate()) != date)
  ) {
    const body =
      type === "timetable"
        ? `Nowy plan lekcji z datą "${date}" jest już dostępny`
        : `Nowe zastepstwa: "${date}" dostępne na planie lekcji`;

    sendNotification({
      title: "Zmiany w planie lekcji",
      options: {
        body,
        tag: date,
        icon: zstioLogo1024.src,
      },
    });

    type === "timetable"
      ? setLastTimetableDate(date)
      : setLastSubstitutionDate(date);
  }
};

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
        if (error instanceof WebPushError && error.statusCode === 410) {
          deleteDoc(subscription.ref);
        }
      });
  });
};
