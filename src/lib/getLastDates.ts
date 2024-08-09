import { doc, getDoc, setDoc } from "@firebase/firestore";
import db from "./firestore";

interface LastDate {
  date: string;
}

export const getLastTimetableDate = async () => {
  const last = await getDoc(doc(db, "last", "timetable"));
  if (last.data()) return (last.data() as LastDate).date;
  return null;
};

export const setLastTimetableDate = async (date: string) => {
  await setDoc(doc(db, "last", "timetable"), { date });
};

export const getLastSubstitutionDate = async () => {
  const last = await getDoc(doc(db, "last", "substitution"));
  if (last.data()) return (last.data() as LastDate).date;
  return null;
};

export const setLastSubstitutionDate = async (date: string) => {
  await setDoc(doc(db, "last", "substitution"), { date });
};
