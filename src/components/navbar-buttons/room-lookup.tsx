import RoomLookupModal from "@/components/modals/room-lookup/room-lookup";
import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const RoomLookup: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <RoomLookupModal isOpened={isOpened} setIsOpened={setIsOpened} />
      <ButtonWrapper
        tooltipText="Wyszukaj salę"
        onClick={() => setIsOpened(!isOpened)}
      >
        <MagnifyingGlassCircleIcon className="h-4 w-4" />
      </ButtonWrapper>
    </>
  );
};

export default RoomLookup;
