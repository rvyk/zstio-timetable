import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import {
  ArrowPathRoundedSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

function RedirectButton() {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";

  const router = useRouter();

  const redirect = () => {
    if (!isSubstitution) {
      return router.replace("/zastepstwa");
    }

    const lastSelect = localStorage.getItem("lastSelect");
    lastSelect ? router.replace(lastSelect) : router.replace("/class/1");
  };

  return (
    <ButtonWrapper
      onClick={redirect}
      tooltipText={
        isSubstitution ? "Przejdź do planu lekcji" : "Przejdź do zastępstw"
      }
    >
      {isSubstitution ? (
        <CalendarDaysIcon className="w-4 h-4" />
      ) : (
        <ArrowPathRoundedSquareIcon className="w-4 h-4" />
      )}
    </ButtonWrapper>
  );
}

export default RedirectButton;
