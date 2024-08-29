"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const Loading: React.FC = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots === "..." ? "." : prevDots + "."));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      className="my-4 flex w-full items-center justify-center text-xl text-gray-500 transition-all dark:text-gray-300"
    >
      <ReloadIcon className="mr-2 mt-1 h-5 w-5 animate-spin lg:h-6 lg:w-6" />
      <h1 className="lg:text-2xl">Wczytywanie planu{dots}</h1>
    </div>
  );
};

export default Loading;
