import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

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
