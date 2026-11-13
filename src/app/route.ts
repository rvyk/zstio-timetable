import { lastVisitedPath } from "@/lib/lastVisited.server";
import { redirect } from "next/navigation";

export const GET = async () => {
  redirect(await lastVisitedPath());
};
