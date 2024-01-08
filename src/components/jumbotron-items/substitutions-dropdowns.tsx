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
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

type CheckedItemsType = {
  [key: string]: string[];
};

type Names = "branches" | "teachers";

const SubstitutionsDropdowns: React.FC<{ substitutions: Substitutions }> = ({
  substitutions,
}) => {
  let uniqueTeachers = new Set<string>();
  let uniqueBranches = new Set<string>();

  substitutions.tables.forEach((table: SubstitutionTables) => {
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
      <SubstitutionDropdown
        item={uniqueData.branches}
        icon={<AcademicCapIcon />}
        name="branches"
      />

      <SubstitutionDropdown
        item={uniqueData.teachers}
        icon={<UsersIcon />}
        name="teachers"
      />
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
  const [filter, setFilter] = useState("");
  const [checkedItems, setCheckedItems] = useState<CheckedItemsType>({});
  const [isOpened, setIsOpened] = useState(false);

  const router = useRouter();

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

      const newQuery = { ...router.query };
      if (!updatedItems.length) {
        delete newQuery[category];
      } else {
        newQuery[category] = queryValue;
      }
      router.replace({ query: newQuery }, undefined, { shallow: true });
      return { ...prevItems, [category]: updatedItems };
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const branches = queryParams.get("branches")?.split(",") || [];
    const teachers = queryParams.get("teachers")?.split(",") || [];

    setCheckedItems({
      branches,
      teachers,
    });
  }, []);

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
            isOpened && "dark:bg-[#131313] bg-[#73110e] text-white"
          }`}
        >
          <span className="h-5 w-5 mr-2">{icon}</span>
          {translations[name as Names]}
          <ChevronDownIcon
            className={`w-4 h-4 ml-2 ${
              isOpened && "rotate-180"
            } transition-all`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mt-2 max-h-60 overflow-y-scroll bg-white rounded-l-lg shadow dark:bg-[#131313] border-0">
        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
            <Input
              autoFocus
              type="text"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#202020] dark:focus:border-[#202020]"
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
            className={`flex items-center my-0.5 pl-2 rounded hover:bg-gray-100 dark:hover:bg-[#202020] dark:focus:bg-[#202020] ${
              checkedItems[name]?.includes(substitution) &&
              "bg-gray-100 dark:bg-[#202020]"
            }`}
          >
            <p className="w-full py-1 ml-4 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
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
