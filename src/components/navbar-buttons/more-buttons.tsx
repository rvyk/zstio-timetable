import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

const MoreButtons: React.FC = () => {
  return (
    <>
      <ButtonWrapper tooltipText="Więcej opcji">
        <EllipsisHorizontalIcon className="h-4 w-4" />
      </ButtonWrapper>
    </>
  );
};

export default MoreButtons;
