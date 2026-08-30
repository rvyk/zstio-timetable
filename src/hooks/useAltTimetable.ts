import { env } from "@/env";
import { useEffect, useState } from "react";

let check: Promise<boolean> | undefined;

const isReachable = () => {
  check ??= fetch("/api/alt-timetable")
    .then((response) => response.json())
    .then((data: { ok: boolean }) => data.ok)
    .catch(() => false);

  return check;
};

export const useAltTimetable = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ALT_TIMETABLE_URL) return;
    void isReachable().then(setIsAvailable);
  }, []);

  return isAvailable;
};
