import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { NavigationMenuTrigger } from "../ui/navigation-menu";

const MoreButtons: React.FC = () => {
  return (
    <>
      <NavigationMenuTrigger>
        <ButtonWrapper tooltipText="Więcej opcji">
          <EllipsisHorizontalIcon className="h-4 w-4" />
        </ButtonWrapper>
      </NavigationMenuTrigger>
    </>
  );
};

export default MoreButtons;
