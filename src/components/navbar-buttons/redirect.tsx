"use client";

import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import {
  ArrowPathRoundedSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";

const RedirectButton: React.FC = () => {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";

  const router = useRouter();

  const redirect = () => {
    if (!isSubstitution) {
      return router.replace("/zastepstwa");
    }

    const lastSelect = localStorage.getItem("lastSelect");
    const route = lastSelect || "/class/1";
    router.replace(route);
  };

  return (
    <ButtonWrapper
      onClick={redirect}
      tooltipText={
        isSubstitution ? "Przejdź do planu lekcji" : "Przejdź do zastępstw"
      }
    >
      {isSubstitution ? (
        <CalendarDaysIcon className="h-4 w-4" />
      ) : (
        <ArrowPathRoundedSquareIcon className="h-4 w-4" />
      )}
    </ButtonWrapper>
  );
};

export default RedirectButton;
