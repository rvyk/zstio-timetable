import RoomLookupModal from "@/components/modals/room-lookup/room-lookup";
import ButtonWrapper from "@/components/navbar-buttons/wrapper";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function RoomLookup() {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <RoomLookupModal isOpened={isOpened} setIsOpened={setIsOpened} />
      <ButtonWrapper
        tooltipText="Wyszukaj salę"
        onClick={() => setIsOpened(!isOpened)}
      >
        <MagnifyingGlassCircleIcon className="w-4 h-4" />
      </ButtonWrapper>
    </>
  );
}

export default RoomLookup;
