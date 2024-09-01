"use client";

import { ReloadIcon } from "@radix-ui/react-icons";

const Loading: React.FC = () => {
  return (
    <div
      role="status"
      className="mb-4 mt-2 flex w-full items-center justify-center text-xl text-gray-500 transition-all dark:text-gray-300 max-lg:mb-6"
    >
      <ReloadIcon className="mr-2 mt-1 h-5 w-5 animate-spin lg:h-6 lg:w-6" />
      <h1 className="lg:text-xl">Wczytywanie planu, proszę czekać</h1>
    </div>
  );
};

export default Loading;
