import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

interface DropdownProps {
  results: { type: string; name: string; value: string }[];
  setIsDrawerOpened?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpened?: boolean;
  title?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpened,
  results,
  title,
  setIsDrawerOpened,
}) => {
  const router = useRouter();
  const [lastSelect, setLastSelect] = useState<string | null>(null);

  const handleSelect = (name: string, value: string) => {
    const link = `/${name}/${value}`;
    setLastSelect(link);
    localStorage.setItem("lastSelect", link);
    router.push(link);
    setIsDrawerOpened && setIsDrawerOpened(false);
  };

  useEffect(() => {
    setLastSelect(router.asPath);
  }, [router.asPath]);

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
              {results?.map((item: DropdownProps["results"][0]) => (
                <Menu.Item
                  as={Fragment}
                  key={`item-${item.type}-${item.value}`}
                >
                  <button
                    onClick={() => handleSelect(item.type, item.value)}
                    className="relative my-0.5 flex w-full cursor-default select-none items-center rounded p-1 px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-200 focus:bg-accent focus:text-accent-foreground dark:hover:bg-[#202020] dark:focus:bg-[#202020]"
                  >
                    <p className="ml-2 w-full rounded py-1 text-left text-sm font-medium text-gray-900 dark:text-gray-300">
                      {item.name}
                    </p>
                  </button>
                </Menu.Item>
              ))}
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
