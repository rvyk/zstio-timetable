import { useEffect, useState } from "react";

/** Najdłuższa animacja wyjścia w globals.css (fall 0.16s) z zapasem. */
const EXIT_MS = 200;

/**
 * Trzyma element zamontowany aż do końca animacji wyjścia. Bez tego `{isOpen &&
 * …}` znika w jednej klatce i widać tylko otwieranie — zamykanie jest ucięte.
 *
 * Odliczanie zamiast nasłuchu `animationend`: zdarzenie bąbelkuje z kaskady
 * dzieci i nie odpala się przy wyłączonych animacjach, więc element potrafiłby
 * zostać na stałe. Stały czas jest tępy, ale zawsze kończy.
 */
export const usePresence = (isOpen: boolean, exitMs: number = EXIT_MS) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  // korekta stanu w trakcie renderu, nie w efekcie: montujemy w tym samym
  // przebiegu, więc animacja wejścia startuje bez dodatkowej klatki
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
