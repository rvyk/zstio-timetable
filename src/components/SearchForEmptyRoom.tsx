import { Dialog, Menu, RadioGroup, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { days } from "../utils/helpers";

function SearchForEmptyRoom(
  {
    searchDialog,
    setSearchDialog,
    setSelectedDay,
  }: {
    searchDialog: boolean;
    setSearchDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  },
) {
  const [selectedDayForQuery, setSelectedDayForQuery] = useState(0);
  const [lessonIndex, setLessonindex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  function closeModal() {
    setSearchDialog(false);
  }

  const handleButton = async () => {
    if (loading) return;
    setLoading(true);
    const res = await axios.get(
      `/api/timetable/empty?day=${selectedDayForQuery}&lesson=${
        lessonIndex - 1
      }`,
    );
    if (res.data.success) {
      setData(res.data.classes);
    }
    setLoading(false);
  };

  return (
    <>
      <Transition appear show={searchDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 transition-all"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#212121] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-center font-medium leading-6 text-gray-900 dark:text-gray-100 flex justify-center items-center w-full"
                  >
                    Wyszukaj wolną salę
                    <MagnifyingGlassIcon className="h-5 w-5 mt-1 ml-2" />
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-center text-gray-500 dark:text-gray-100">
                      Wybierz dzień tygodnia
                    </p>
                  </div>
                  <div className="w-full">
                    <div className="w-full">
                      <RadioGroup
                        value={selectedDayForQuery}
                        onChange={(e) => {
                          setSelectedDayForQuery(e);
                        }}
                      >
                        <div className="flex justify-center flex-wrap">
                          {days.map((day) => (
                            <RadioGroup.Option
                              key={day.index}
                              value={day.index}
                              className={({ checked }) =>
                                `${
                                  checked &&
                                  "!bg-[#321c21] !text-gray-100 dark:!bg-[#171717]"
                                } flex transition-all items-center p-3 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 dark:ring-0 dark:focus:ri focus:ring-[#313131] dark:bg-[#313131] dark:text-gray-200 dark:border-[#202020] dark:hover:border-[#171717] dark:hover:text-white dark:hover:bg-[#171717] lg:dark:hover:bg-[#141414] cursor-pointer my-2 mx-2 min-w-[4rem]`
                              }
                            >
                              <div className="flex w-full items-center justify-between text-center">
                                <div className="flex items-center w-full">
                                  <div className="text-sm text-center w-full">
                                    <RadioGroup.Label as="p">
                                      {day.short}
                                    </RadioGroup.Label>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                      <div className="mt-2">
                        <p className="text-md text-center text-gray-500 dark:text-gray-100">
                          Wpisz numer lekcji
                        </p>
                      </div>
                      <div className="w-full flex justify-center">
                        <input
                          type="number"
                          min="1"
                          id="input-group-search"
                          autoComplete="off"
                          className="block mt-2 w-1/2 p-2 text-center text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 focus:ring-[#2B161B] focus:border-[#2B161B] dark:bg-[#171717] dark:ring-0 dark:border-0 dark:focus:ring-0 dark:placeholder-gray-200 dark:text-white"
                          placeholder="Numer lekcji"
                          value={lessonIndex}
                          onChange={(e) => {
                            setLessonindex(
                              parseInt(e.target.value) < 1
                                ? 1
                                : parseInt(e.target.value),
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 w-full justify-center flex">
                    <button
                      type="button"
                      className="hover:text-[#a91712] text-white border-transparent hover:bg-transparent dark:border-[2px] border-[1px] hover:border-[#a91712] mx-2 sm:my-0 my-2 bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-100 hover:dark:text-white dark:hover:bg-red-600 dark:rounded-lg dark:border-none dark:bg-red-400 dark:outline-none"
                      onClick={handleButton}
                      disabled={loading}
                    >
                      {loading ? (
                        <svg
                          className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-red-600 dark:fill-red-500"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      ) : (
                        "Wyszukaj"
                      )}
                    </button>
                    <button
                      className="text-[#a91712] hover:text-white hover:border-transparent bg-transparent dark:border-[2px] border-[1px] border-[#a91712] mx-2 sm:my-0 my-2 hover:bg-[#73110e] transition-all focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:text-gray-300 hover:dark:text-white dark:bg-[#161616] dark:rounded-lg dark:border-none dark:hover:bg-[#141414] dark:outline-none"
                      onClick={closeModal}
                    >
                      Anuluj
                    </button>
                  </div>

                  <div>
                    {data != null && (
                      <Menu as="div" className="text-left w-full my-4">
                        {({ open }) => (
                          <>
                            <div>
                              <Menu.Button
                                disabled={!data?.length}
                                className="inline-flex w-full justify-center dark:text-gray-300 rounded-md bg-[#2B161B] hover:bg-[#201114] dark:bg-[#171717] py-2 text-md font-medium text-white dark:hover:bg-[#151515] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                              >
                                {data?.length
                                  ? `Znaleziono (${data?.length}) wyników`
                                  : "Nic nie znaleziono"}
                                {data?.length > 0 && (
                                  <ChevronDownIcon
                                    className={`ml-2 mt-1 -mr-1 h-6 w-6 text-white hover:text-gray-50 transition-all duration-300 ${
                                      open && "rotate-180"
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="max-h-[30vh] mt-3 overflow-y-scroll mx-4 right-0 left-0 origin-top-right divide-y divide-gray-100 dark:divide-[#323232] rounded-md bg-gray-50 dark:bg-[#202020] shadow-lg ring-0 focus:outline-none">
                                {data.map((item) => (
                                  <div className="px-2 py-2" key={item.name}>
                                    <Menu.Item as={Fragment}>
                                      {({ active }) => (
                                        <Link
                                          prefetch={false}
                                          href={
                                            item.url || `/room/${item.value}`
                                          }
                                          onClick={() => {
                                            closeModal();
                                            setSelectedDay(selectedDayForQuery);
                                          }}
                                          className={`${
                                            active
                                              ? "dark:bg-[#171717] dark:text-gray-300 text-black bg-gray-100 font-semibold"
                                              : "text-gray-900 dark:text-gray-300 font-semibold"
                                          } group flex w-full items-center rounded-md px-2 py-2 transition-all text-sm duration-300`}
                                        >
                                          {item.name}
                                        </Link>
                                      )}
                                    </Menu.Item>
                                  </div>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </>
                        )}
                      </Menu>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default SearchForEmptyRoom;
