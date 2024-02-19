"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
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
            className={`ml-2 h-4 w-4 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 max-h-60 w-60 overflow-y-scroll rounded-lg border-0 bg-white shadow dark:bg-[#161616]">
        {data.map((item: any, index: number) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              setIsModalOpened(false);
              router.push(item.url || `/room/${item.value}`);
            }}
            className="my-0.5 flex cursor-pointer items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-[#202020] dark:focus:bg-[#202020]"
          >
            <p className="ml-2 w-full rounded py-1 text-sm font-medium text-gray-900 dark:text-gray-300">
              {item.name}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
