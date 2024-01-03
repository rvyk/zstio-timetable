import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeButton({
  toggleTheme,
  resolvedTheme,
}: {
  toggleTheme: () => void;
  resolvedTheme: string;
}) {
  return (
    <ButtonWrapper tooltipText="Zmień motyw" onClick={toggleTheme}>
      {resolvedTheme === "light" ? (
        <SunIcon className="w-4 h-4 transition-none" />
      ) : (
        <MoonIcon className="w-4 h-4 transition-none" />
      )}
    </ButtonWrapper>
  );
}

export default ThemeButton;
