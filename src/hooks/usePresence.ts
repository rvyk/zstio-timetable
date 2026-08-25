import { useEffect, useState } from "react";

const EXIT_MS = 200;

export const usePresence = (isOpen: boolean, exitMs: number = EXIT_MS) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  if (isOpen && !isMounted) setIsMounted(true);

  useEffect(() => {
    if (isOpen) return;
    const timeout = setTimeout(() => setIsMounted(false), exitMs);
    return () => clearTimeout(timeout);
  }, [isOpen, exitMs]);

  return {
    isMounted,
    presenceProps: { "data-state": isOpen ? "open" : "closed" },
  } as const;
};
