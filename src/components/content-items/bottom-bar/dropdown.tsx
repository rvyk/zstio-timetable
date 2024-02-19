"use client";

import { CheckedItemsType } from "@/components/jumbotron-items/substitutions-dropdowns";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";

interface DropdownProps {
  results: { type: string; name: string; value: string }[];
  setIsDrawerOpened?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpened?: boolean;
  title?: string;
  isSubstitutions?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpened,
  results,
  title,
  setIsDrawerOpened,
  isSubstitutions,
}) => {
  const queryParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();
  const [lastSelect, setLastSelect] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<CheckedItemsType>({});

  const handleSelect = (name: string, value: string) => {
    const link = `/${name}/${value}`;
    setLastSelect(link);
    localStorage.setItem("lastSelect", link);
    router.push(link);
    setIsDrawerOpened && setIsDrawerOpened(false);
  };

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

  // useEffect(() => {
  //   const queryFilters = router.query;
  //   const newCheckedItems: CheckedItemsType = {};

  //   for (const category in queryFilters) {
  //     const queryValue = queryFilters[category];
  //     if (typeof queryValue === "string") {
  //       const items = queryValue.split(",");
  //       newCheckedItems[category] = items;
  //     }
  //   }

  //   setCheckedItems(newCheckedItems);
  // }, [router.query]);
  return (
    <Menu as="div" className="w-full text-left">
      {({ open }) => (
        <>
          {title && <DropdownButton {...{ title, open }} />}
          <Transition
            show={isOpened || open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 right-0 z-40 mt-2.5 max-h-48 w-screen overflow-y-scroll rounded-lg border-0 bg-white p-1 shadow dark:bg-[#131313]">
              {Array.from(new Set(results))?.map(
                (item: DropdownProps["results"][0]) => {
                  return (
                    <Menu.Item as="div" key={`item-${item.type}-${item.value}`}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isSubstitutions) {
                            handleCheckbox(item.type, item.value);
                          } else {
                            handleSelect(item.type, item.value);
                          }
                        }}
                        className="relative my-0.5 flex w-full cursor-default select-none items-center rounded p-1 px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-200 focus:bg-accent focus:text-accent-foreground dark:hover:bg-[#202020] dark:focus:bg-[#202020]"
                      >
                        {isSubstitutions && (
                          <>
                            <Checkbox
                              onChange={() => {}}
                              // classNames={{
                              //   icon: "text-white",
                              //   wrapper: cn(
                              //     "transition-colors delay-75 bg-gray-100 dark:bg-[#282828] rounded border-2 border-gray-200 dark:border-[#202020] cursor-pointer",
                              //     !!checkedItems[item.type]?.includes(
                              //       item.value,
                              //     ) && "bg-blue-600 dark:bg-blue-700",
                              //   ),
                              //   base: "cursor-default",
                              // }}
                              checked={true}
                            />
                          </>
                        )}
                        <p className="ml-2 w-full rounded py-1 text-left text-sm font-medium text-gray-900 dark:text-gray-300">
                          {item.name}
                        </p>
                      </button>
                    </Menu.Item>
                  );
                },
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

interface DropdownButtonProps {
  title: string | undefined;
  open: boolean;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ title, open }) => {
  return (
    <div className="my-1.5 w-screen px-4">
      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-[#2B161B] py-4 text-lg font-medium text-white transition-all hover:bg-[#201114] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:bg-[#202020] dark:text-gray-300 dark:hover:bg-opacity-50">
        {title}

        <ChevronDownIcon
          className={`-mr-1 ml-2 mt-1 h-6 w-6 text-white transition-all duration-300 hover:text-gray-50 ${
            open && "rotate-180"
          }`}
          aria-hidden="true"
        />
      </Menu.Button>
    </div>
  );
};

export { Dropdown, DropdownButton };
