"use client";

import { parseBranchField } from "@/components/content-items/substitutions/substitutions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AcademicCapIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

export type CheckedItemsType = {
  [key: string]: string[];
};

type Names = "branches" | "teachers";

const SubstitutionsDropdowns: React.FC<{
  substitutions: SubstitutionsPage;
}> = ({ substitutions }) => {
  let uniqueTeachers = new Set<string>();
  let uniqueBranches = new Set<string>();

  substitutions.tables.forEach((table: SubstitutionTable) => {
    table.zastepstwa.forEach((substitution: Substitution) => {
      uniqueTeachers.add(substitution.teacher);
      uniqueBranches.add(substitution.branch);
    });
  });

  const uniqueData = {
    teachers: Array.from(uniqueTeachers),
    branches: Array.from(uniqueBranches),
  };

  return (
    <>
      {!!uniqueData.branches.length && (
        <SubstitutionDropdown
          item={uniqueData.branches}
          icon={<AcademicCapIcon />}
          name="branches"
        />
      )}

      {!!uniqueData.teachers.length && (
        <SubstitutionDropdown
          item={uniqueData.teachers}
          icon={<UsersIcon />}
          name="teachers"
        />
      )}
    </>
  );
};

interface SubstitutionDropdownProps {
  item: string[];
  name: string;
  icon: React.ReactNode;
}

const SubstitutionDropdown: React.FC<SubstitutionDropdownProps> = ({
  item,
  name,
  icon,
}) => {
  const queryParams = useSearchParams();
  const branches = queryParams.get("branches")?.split(",") || [];
  const teachers = queryParams.get("teachers")?.split(",") || [];

  const [filter, setFilter] = useState("");
  const [checkedItems, setCheckedItems] = useState<CheckedItemsType>({
    branches,
    teachers,
  });
  const [isOpened, setIsOpened] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const translations = {
    teachers: "Filtruj wg. nauczycieli",
    branches: "Filtruj wg. oddziałów",
  };

  const items = useMemo(() => {
    return item.filter((item: any) =>
      item.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [item, filter]);

  const handleCheckbox = (category: string, item: string) => {
    setCheckedItems((prevItems) => {
      const currentItems = prevItems[category] || [];
      const updatedItems = currentItems.includes(item)
        ? currentItems.filter((i) => i !== item)
        : [...currentItems, item];

      const queryValue = updatedItems.join(",");

      const oldCategory = category === "branches" ? "teachers" : "branches";
      const oldQuery = queryParams.get(oldCategory);
      if (!updatedItems.length) {
        if (oldQuery != null) {
          router.push(
            `${pathname}?${new URLSearchParams(`${oldCategory}=${oldQuery}`).toString()}`,
          );
        } else {
          router.push(pathname);
        }
      } else {
        if (oldQuery != null) {
          router.push(
            `${pathname}?${new URLSearchParams(`${category}=${queryValue}`).toString()}&${new URLSearchParams(`${oldCategory}=${oldQuery}`).toString()}`,
          );
        } else {
          router.push(
            `${pathname}?${new URLSearchParams(`${category}=${queryValue}`).toString()}`,
          );
        }
      }
      return { ...prevItems, [category]: updatedItems };
    });
  };

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={() => setIsOpened(!isOpened)}
      open={isOpened}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="dropdown"
          size="dropdown"
          className={`${
            isOpened && "bg-[#73110e] text-white dark:bg-[#131313]"
          }`}
        >
          <span className="mr-2 h-5 w-5">{icon}</span>
          {translations[name as Names]}
          <ChevronDownIcon
            className={`ml-2 h-4 w-4 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 max-h-60 w-60 overflow-y-scroll rounded-l-lg border-0 bg-white shadow dark:bg-[#131313]">
        <div className="p-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </div>
            <Input
              autoFocus
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 transition-all duration-200 focus:border-[#2B161B] focus:ring-[#2B161B] dark:border-gray-500 dark:bg-[#171717] dark:text-white dark:placeholder-gray-400 dark:focus:border-[#202020] dark:focus:ring-[#202020]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {items.map((substitution: string, index: number) => (
          <DropdownMenuCheckboxItem
            key={index}
            onCheckedChange={() => handleCheckbox(name, substitution)}
            onSelect={(e) => e.preventDefault()}
            checked={checkedItems[name]?.includes(substitution) || false}
            className={`my-0.5 flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-[#202020] dark:focus:bg-[#202020] ${
              checkedItems[name]?.includes(substitution) &&
              "bg-gray-100 dark:bg-[#202020]"
            }`}
          >
            <p className="ml-4 w-full rounded py-1 text-sm font-medium text-gray-900 dark:text-gray-300">
              {name == "branches"
                ? parseBranchField(substitution)
                : substitution}
            </p>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubstitutionsDropdowns;
