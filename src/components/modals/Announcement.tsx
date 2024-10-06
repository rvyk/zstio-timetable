"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import useModalsStore from "@/stores/modals";
import { getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { FC, useEffect } from "react";

const COOKIE_NAME = "announcement_modal_seen";
const COOKIE_EXPIRATION_HOURS = 3;

export const AnnouncementModal: FC = () => {
  const modalState = useModalsStore((state) =>
    state.getModalState("announcement"),
  );
  const setModalState = useModalsStore((state) => state.setModalState);

  useEffect(() => {
    const modalSeen = getCookie(COOKIE_NAME);

    if (!modalSeen) {
      setModalState("announcement", { isOpen: true });
    }
  }, [setModalState]);

  const handleOpenChange = (open: boolean) => {
    setModalState("announcement", { isOpen: open });

    if (!open) {
      const expirationDate = new Date();
      expirationDate.setHours(
        expirationDate.getHours() + COOKIE_EXPIRATION_HOURS,
      );
      setCookie(COOKIE_NAME, "true", { expires: expirationDate });
    }
  };

  const features = [
    "Ulubione: Dodawaj swoje ulubione klasy, sale i nauczycieli, żeby mieć do nich błyskawiczny dostęp.",
    "Kalkulator skróconych lekcji: Szybko obliczaj zmienione godziny zajęć.",
    "Wyszukiwarka wolnych sal: Znajdź dostępne sale na wybranej lekcji oraz w danym dniu.",
    "Tryb pełnoekranowy: Naciśnij F11 lub klawisz F na komputerze, aby przejść do trybu pełnoekranowego.",
  ];

  return (
    <Dialog open={modalState?.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Witamy w nowej wersji planu lekcji! 🚀</DialogTitle>
          <DialogDescription>
            Z przyjemnością przedstawiamy całkowicie odświeżony plan lekcji,
            napisany całkowicie od podstaw. Nowa wersja jest szybsza, bardziej
            zoptymalizowana i wyposażona w dodatkowe funkcje.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1">
          <h2 className="text-sm font-medium sm:text-base">Co nowego?</h2>
          <ul className="grid list-disc gap-2 pl-6 text-primary/70">
            {features.map((feature) => (
              <li className="text-xs font-medium sm:text-sm" key={feature}>
                <span className="font-semibold text-primary/90">
                  {feature.slice(0, feature.indexOf(":") + 1)}
                </span>
                {feature.slice(feature.indexOf(":") + 1)}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary/50">
          Kod jest w pełni otwarty i dostępny na naszym{" "}
          <Link
            href="https://github.com/rvyk/zstio-timetable/"
            className="underline"
            target=""
          >
            Githubie
          </Link>
          . Zachęcamy do przeglądania, współtworzenia i zgłaszania sugestii.
        </p>

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)} variant="secondary">
            Zamknij
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
