import { lastVisitedPath } from "@/lib/lastVisited.server";
import { redirect } from "next/navigation";

const Page = async () => {
  redirect(await lastVisitedPath());
};

export default Page;
