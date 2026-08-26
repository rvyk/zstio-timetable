import { cookies } from "next/headers";

const TIMETABLE_PATH = /^\/(class|teacher|room)\/\d+$/;

export const lastVisitedPath = async (): Promise<string> => {
  const lastVisited = (await cookies()).get("lastVisited")?.value ?? "";
  return TIMETABLE_PATH.test(lastVisited) ? lastVisited : "/class/1";
};
