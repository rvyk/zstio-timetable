import { resolveRedirectPath } from "@/lib/lastVisited";
import { cookies } from "next/headers";

export const lastVisitedPath = async (): Promise<string> => {
  const store = await cookies();
  return resolveRedirectPath(
    store.get("defaultPlan")?.value,
    store.get("lastVisited")?.value,
  );
};
