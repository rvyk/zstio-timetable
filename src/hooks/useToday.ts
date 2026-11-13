import { warsawToday } from "@/lib/dates";
import { useSyncExternalStore } from "react";

const NEVER_CHANGES = () => () => {};

export const useToday = (renderedOn: Date) => {
  const today = useSyncExternalStore(
    NEVER_CHANGES,
    () => warsawToday().getTime(),
    () => renderedOn.getTime(),
  );

  return new Date(today);
};
