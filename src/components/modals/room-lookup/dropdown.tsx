import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface DropdownProps {
  data: any;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dropdown: React.FC<DropdownProps> = ({
  data,
  setIsOpened: setIsModalOpened,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();

  if (!data) return null;

  return (
    <DropdownMenu onOpenChange={() => setIsOpened(!isOpened)} open={isOpened}>
      <DropdownMenuTrigger asChild disabled={!!!data.length}>
        <Button
          variant="dropdown"
          size="dropdown"
          className="dark:bg-[#141414] dark:hover:bg-[#161616]"
        >
          Znaleziono {data.length} wyników
          <ChevronDownIcon
            className={`w-4 h-4 ml-2 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-2 max-h-60 overflow-y-scroll bg-white rounded-lg shadow dark:bg-[#161616] border-0">
        {data.map((item: any, index: number) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              setIsModalOpened(false);
              router.push(item.url || `/room/${item.value}`);
            }}
            className="flex items-center cursor-pointer my-0.5 pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] dark:focus:bg-[#202020]"
          >
            <p className="w-full py-1 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
              {item.name}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
